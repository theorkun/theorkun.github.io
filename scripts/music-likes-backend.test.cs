using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;

public class LikesTests {
    static void Check(bool value,string name) { if (!value) throw new Exception(name); Console.WriteLine("PASS "+name); }
    static string Visitor(int n) { return n.ToString("x64"); }
    public static int Main(string[] args) {
        if (args.Length == 6 && args[0] == "api") {
            Console.Write(CeyhaniMusicLikes.UpdateStore(args[1],args[2].Split(','),args[3] == "-" ? null : args[3],args[4] == "-" ? null : args[4],args[5] == "-" ? (bool?)null : args[5] == "1"));return 0;
        }
        if (args.Length == 5 && args[0] == "store") {
            Console.Write(CeyhaniMusicLikes.UpdateStore(args[1],new[]{"first","second"},args[2] == "-" ? null : args[2],args[3] == "-" ? null : args[3],args[4] == "-" ? (bool?)null : args[4] == "1"));return 0;
        }
        string root=Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"likes-test-"+Guid.NewGuid().ToString("N"));
        string[] ids={"first","second"};
        Func<string,string,bool?,string> update=(visitor,track,liked)=>CeyhaniMusicLikes.UpdateStore(root,ids,visitor,track,liked);
        Check(update(null,null,null).Contains("\"first\":0"),"new visitors see zero real totals without a vote");
        Check(update(Visitor(1),"first",true).Contains("\"first\":1"),"first vote saved");
        Check(update(Visitor(1),"first",true).Contains("\"first\":1"),"repeat like is idempotent");
        Check(update(Visitor(2),"first",true).Contains("\"first\":2"),"different browsers share totals");
        Check(update(Visitor(1),null,null).Contains("\"liked\":[\"first\"]"),"saved vote returned after page reload");
        Check(update(Visitor(1),"first",false).Contains("\"first\":1"),"unlike removes exactly one vote");
        Check(update(Visitor(1),"first",false).Contains("\"first\":1"),"repeated unlike never makes totals negative");
        bool rejected=false;try{update(Visitor(1),"../unknown",true);}catch(ArgumentException){rejected=true;}Check(rejected,"unknown track rejected");
        Parallel.For(3,23,i=>update(Visitor(i),"first",true));
        Check(update(null,null,null).Contains("\"first\":21"),"concurrent writes preserve every vote");
        string xml=File.ReadAllText(Path.Combine(root,"ceyhani-music-likes.xml"));
        Check(!xml.Contains("<script")&&!xml.Contains("http")&&xml.Contains("visitor=\""),"only pseudonymous vote keys stored");
        Check(Directory.GetFiles(root,"*.tmp").Length==0,"atomic writes leave no temporary data");
        var workIds=CeyhaniMusicLikes.ReadIds("{\"id\":\"first\"},{\"id\":\"second\"}","{\"poemNo\":1},{\"poemNo\":2},{\"poemNo\":1},{\"poemNo\":0}");
        Check(workIds.SequenceEqual(new[]{"first","second","poem-1","poem-2"}),"stable poem IDs are distinct from tracks and reject zero");
        string combined=CeyhaniMusicLikes.UpdateStore(root,workIds,Visitor(1),"poem-1",true);
        Check(combined.Contains("\"first\":21")&&combined.Contains("\"poem-1\":1"),"adding poetry preserves existing song votes");
        Check(CeyhaniMusicLikes.UpdateStore(root,workIds,Visitor(1),"poem-1",true).Contains("\"poem-1\":1"),"poem like is idempotent");
        Check(CeyhaniMusicLikes.UpdateStore(root,workIds,Visitor(1),"poem-1",false).Contains("\"poem-1\":0"),"poem unlike preserves other works");
        var sameOrigin=typeof(CeyhaniMusicLikes).GetMethod("SameOrigin",BindingFlags.NonPublic|BindingFlags.Static);
        Check((bool)sameOrigin.Invoke(null,new object[]{new HttpContext(new OriginRequest("https://example.test")).Request}),"same-origin POST accepted");
        Check(!(bool)sameOrigin.Invoke(null,new object[]{new HttpContext(new OriginRequest("https://evil.test")).Request}),"cross-origin POST rejected");
        Check(!(bool)sameOrigin.Invoke(null,new object[]{new HttpContext(new OriginRequest("null")).Request}),"opaque origin rejected");
        string malicious=Path.Combine(root,"invalid");Directory.CreateDirectory(malicious);
        File.WriteAllText(Path.Combine(malicious,"ceyhani-music-likes.xml"),"<!DOCTYPE likes [<!ENTITY x SYSTEM 'file:///C:/Windows/win.ini'>]><likes>&x;</likes>");
        rejected=false;try{CeyhaniMusicLikes.UpdateStore(malicious,ids,null,null,null);}catch(System.Xml.XmlException){rejected=true;}Check(rejected,"XML external entities are forbidden");
        var server = new Uri("https://asikceyhani.com.tr/music-likes.ashx");
        foreach (string allowed in new[]{"https://theorkun.github.io","https://asikceyhani.com.tr","https://www.asikceyhani.com.tr","http://localhost:8089","http://127.0.0.1:18269","http://[::1]:3000"})
            Check(CeyhaniMusicLikes.AllowedOrigin(allowed,server),"CORS allows "+allowed);
        foreach (string denied in new[]{"null","https://evil.test","https://theorkun.github.io.evil.test","https://theorkun.github.io:444","https://evil.test@theorkun.github.io","https://theorkun.github.io/path","http://192.168.1.1:8080"})
            Check(!CeyhaniMusicLikes.AllowedOrigin(denied,server),"CORS rejects "+denied);
        Console.WriteLine("32 backend checks passed.");return 0;
    }
    class OriginRequest : SimpleWorkerRequest {
        readonly string origin;
        public OriginRequest(string value) : base("/",AppDomain.CurrentDomain.BaseDirectory,"music-likes.ashx","",new StringWriter()) {origin=value;}
        public override string[][] GetUnknownRequestHeaders() {return new[]{new[]{"Origin",origin}};}
        public override string GetKnownRequestHeader(int index) {return index==HeaderHost?"example.test":null;}
        public override string GetServerName() {return "example.test";}
        public override int GetLocalPort() {return 443;}
        public override bool IsSecure() {return true;}
        public override string GetProtocol() {return "https";}
    }
}
