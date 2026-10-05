"""Refresh the public channel video catalogue without downloading videos."""
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHANNEL = 'https://www.youtube.com/@AsikCeyhani'


def request(url, payload=None):
    body = json.dumps(payload).encode() if payload else None
    req = urllib.request.Request(url, data=body, headers={
        'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/json'
    })
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode('utf-8')


def objects(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


html = request(CHANNEL + '/videos')
match = re.search(r'var ytInitialData = (.*?);</script>', html)
if not match:
    raise RuntimeError('YouTube channel data could not be read; catalogue unchanged.')
data = json.loads(match.group(1))
metadata = data['metadata']['channelMetadataRenderer']
version = re.search(r'"INNERTUBE_CLIENT_VERSION"\s*:\s*"([^"]+)"', html)
if not version:
    raise RuntimeError('YouTube client version missing; catalogue unchanged.')
context = {'client': {'clientName': 'WEB', 'clientVersion': version.group(1), 'hl': 'tr', 'gl': 'TR'}}
videos = {}
seen_tokens = set()
page = data['contents']
while True:
    tokens = []
    for obj in objects(page):
        video = obj.get('lockupViewModel')
        if video and video.get('contentType') == 'LOCKUP_CONTENT_TYPE_VIDEO':
            video_id = video['contentId']
            title = video['metadata']['lockupMetadataViewModel']['title']['content']
            durations = [item['thumbnailBadgeViewModel'].get('text', '')
                         for item in objects(video['contentImage']) if 'thumbnailBadgeViewModel' in item]
            videos[video_id] = {'id': video_id, 'title': title, 'duration': durations[0] if durations else ''}
        old = obj.get('videoRenderer')
        if old:
            videos[old['videoId']] = {
                'id': old['videoId'],
                'title': ''.join(run['text'] for run in old['title'].get('runs', [])),
                'duration': old.get('lengthText', {}).get('simpleText', '')
            }
        continuation = obj.get('continuationItemRenderer')
        if continuation:
            token = continuation['continuationEndpoint']['continuationCommand']['token']
            if token not in seen_tokens:
                tokens.append(token)
    print(f'Collected {len(videos)} videos', flush=True)
    if not tokens:
        break
    token = tokens[0]
    seen_tokens.add(token)
    page = json.loads(request('https://www.youtube.com/youtubei/v1/browse', {
        'context': context, 'continuation': token
    }))
    if not any('appendContinuationItemsAction' in obj for obj in objects(page)):
        raise RuntimeError('YouTube pagination failed; catalogue unchanged.')

if not videos:
    raise RuntimeError('No videos found; catalogue unchanged.')
catalogue = {'channel': CHANNEL, 'channelId': metadata['externalId'], 'videos': list(videos.values())}
(ROOT / 'assets' / 'youtube-videos.json').write_text(
    json.dumps(catalogue, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
)
print(f'Saved {len(videos)} videos to assets/youtube-videos.json')
