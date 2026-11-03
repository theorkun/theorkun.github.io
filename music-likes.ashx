<%@ WebHandler Language="C#" Class="CeyhaniMusicLikes" %>
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Xml;
using System.Xml.Linq;

public class CeyhaniMusicLikes : IHttpHandler {
    public bool IsReusable { get { return true; } }
    public void ProcessRequest(HttpContext context) {
        context.Response.ContentType = "application/json";
        context.Response.ContentEncoding = Encoding.UTF8;
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.Cache.SetNoStore();
        context.Response.TrySkipIisCustomErrors = true;
        context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        string method = context.Request.HttpMethod;
        string origin = context.Request.Headers["Origin"];
        if (!String.IsNullOrEmpty(origin)) {
            if (!AllowedOrigin(origin,context.Request.Url)) { Error(context,403,"origin"); return; }
            context.Response.Headers["Access-Control-Allow-Origin"] = origin;
            context.Response.Headers["Vary"] = "Origin";
            context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
            context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, X-Ceyhani-Visitor";
            context.Response.Headers["Access-Control-Max-Age"] = "600";
        }
        if (method == "OPTIONS") { context.Response.StatusCode = 204; return; }
        if (method != "GET" && method != "POST") { Error(context,405,"method"); return; }
        if (method == "POST" && !SameOrigin(context.Request)) { Error(context,403,"origin"); return; }
        if (method == "POST" && (context.Request.ContentLength < 1 || context.Request.ContentLength > 1024 || !context.Request.ContentType.StartsWith("application/x-www-form-urlencoded",StringComparison.OrdinalIgnoreCase))) { Error(context,400,"request"); return; }
        try {
            string config = File.ReadAllText(context.Server.MapPath("~/assets/audio-playlist.json"));
            var ids = Regex.Matches(config,"\"id\"\\s*:\\s*\"([a-z0-9-]{1,80})\"").Cast<Match>().Select(m=>m.Groups[1].Value).Distinct().ToArray();
            if (ids.Length == 0) throw new InvalidDataException();
            string track = method == "POST" ? context.Request.Form["track"] : null;
            string desired = method == "POST" ? context.Request.Form["liked"] : null;
            if (method == "POST" && (!ids.Contains(track) || (desired != "1" && desired != "0"))) { Error(context,400,"track"); return; }
            string token = context.Request.Headers["X-Ceyhani-Visitor"];
            if (token != null && !Regex.IsMatch(token,"^[a-f0-9]{32}$")) { Error(context,400,"visitor"); return; }
            if (method == "POST" && token == null) { Error(context,400,"visitor"); return; }
            string visitor = null;
            if (token != null) using (var hash = SHA256.Create()) visitor = BitConverter.ToString(hash.ComputeHash(Encoding.UTF8.GetBytes("ceyhani-like:"+token))).Replace("-","").ToLowerInvariant();
            string result = UpdateStore(context.Server.MapPath("~/App_Data"),ids,visitor,track,method == "POST" ? (bool?)(desired == "1") : null);
            context.Response.Write(result);
        } catch (Exception error) {
            Trace.TraceError("Ceyhani music likes: {0}",error.GetType().Name);
            Error(context,503,"unavailable");
        }
    }
    static bool SameOrigin(HttpRequest request) {
        Uri origin;
        string supplied = request.Headers["Origin"];
        if (!String.IsNullOrEmpty(supplied)) {
            if (!Uri.TryCreate(supplied,UriKind.Absolute,out origin)) return false;
        } else origin = request.UrlReferrer;
        return origin != null && AllowedOrigin(origin.GetLeftPart(UriPartial.Authority),request.Url);
    }
    public static bool AllowedOrigin(string supplied,Uri server) {
        Uri origin;
        if (!Uri.TryCreate(supplied,UriKind.Absolute,out origin) || origin.UserInfo.Length > 0 || origin.AbsolutePath != "/" || origin.Query.Length > 0 || origin.Fragment.Length > 0) return false;
        if (String.Equals(origin.GetLeftPart(UriPartial.Authority),server.GetLeftPart(UriPartial.Authority),StringComparison.OrdinalIgnoreCase)) return true;
        if (origin.Scheme == "https" && origin.IsDefaultPort && (origin.Host == "theorkun.github.io" || origin.Host == "asikceyhani.com.tr" || origin.Host == "www.asikceyhani.com.tr")) return true;
        System.Net.IPAddress address;
        bool ipv6Loopback = System.Net.IPAddress.TryParse(origin.DnsSafeHost,out address) && System.Net.IPAddress.IPv6Loopback.Equals(address);
        return origin.Scheme == "http" && (origin.Host == "localhost" || origin.Host == "127.0.0.1" || ipv6Loopback);
    }
    static void Error(HttpContext context,int status,string code) {
        context.Response.StatusCode = status;
        context.Response.Write("{\"ok\":false,\"error\":\""+code+"\"}");
    }
    // Called under a cross-process file lock; data is never put in a public assets folder.
    public static string UpdateStore(string directory,string[] ids,string visitor,string track,bool? desired) {
        if (desired.HasValue && (!ids.Contains(track) || !Regex.IsMatch(visitor ?? "","^[a-f0-9]{64}$"))) throw new ArgumentException();
        Directory.CreateDirectory(directory);
        string dataPath = Path.Combine(directory,"ceyhani-music-likes.xml");
        FileStream gate = null;
        var watch = Stopwatch.StartNew();
        while (gate == null) {
            try { gate = new FileStream(Path.Combine(directory,"ceyhani-music-likes.lock"),FileMode.OpenOrCreate,FileAccess.ReadWrite,FileShare.None); }
            catch (IOException) { if (watch.ElapsedMilliseconds > 2000) throw; Thread.Sleep(20); }
        }
        using (gate) {
            var votes = ids.ToDictionary(id=>id,id=>new HashSet<string>(StringComparer.Ordinal));
            if (File.Exists(dataPath)) {
                var settings = new XmlReaderSettings { DtdProcessing = DtdProcessing.Prohibit, XmlResolver = null };
                using (var reader = XmlReader.Create(dataPath,settings)) {
                    var xml = XDocument.Load(reader);
                    if (xml.Root == null || xml.Root.Name != "likes") throw new InvalidDataException();
                    foreach (var item in xml.Root.Elements("track")) {
                        string id = (string)item.Attribute("id");
                        if (id == null || !votes.ContainsKey(id)) continue;
                        foreach (var vote in item.Elements("vote")) {
                            string key = (string)vote.Attribute("visitor");
                            if (Regex.IsMatch(key ?? "","^[a-f0-9]{64}$")) votes[id].Add(key);
                        }
                    }
                }
            }
            bool changed = desired.HasValue && (desired.Value ? votes[track].Add(visitor) : votes[track].Remove(visitor));
            if (changed) {
                var xml = new XDocument(new XElement("likes",ids.Select(id=>new XElement("track",new XAttribute("id",id),votes[id].Select(key=>new XElement("vote",new XAttribute("visitor",key)))))));
                string temp = Path.Combine(directory,Path.GetRandomFileName()+".tmp");
                try {
                    xml.Save(temp);
                    if (File.Exists(dataPath)) File.Replace(temp,dataPath,null); else File.Move(temp,dataPath);
                } finally { if (File.Exists(temp)) File.Delete(temp); }
            }
            var counts = ids.Select(id=>"\""+id+"\":"+votes[id].Count.ToString(System.Globalization.CultureInfo.InvariantCulture));
            var liked = ids.Where(id=>visitor != null && votes[id].Contains(visitor)).Select(id=>"\""+id+"\"");
            return "{\"ok\":true,\"counts\":{"+String.Join(",",counts)+"},\"liked\":["+String.Join(",",liked)+"]}";
        }
    }
}
