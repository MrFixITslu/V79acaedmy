#!/usr/bin/env python3
"""Prepare a compatible old-image content store without overwriting learner files.
Offline files only: never pass the running production data directory. The output
is a separate file for a stopped-app cutover, not an in-place live mutation.
"""
import copy,json,pathlib,sys
COURSE='course-from-idea-to-advantage-01'
FIELDS=['lessonContent','studySolution','review','studyVisual','imageUrls','imageAltTexts']
def prepare(current,expected):
 result=copy.deepcopy(current)
 version=next(v for v in current['courseVersions'] if v['id']=='ita-before-self-study-v2-1')
 original=version['snapshot'];old={l['id']:l for l in original['lessons']}
 if len(old)!=36:raise RuntimeError('Expected the complete original 36-lesson snapshot')
 for lesson in result['lessons']:
  if lesson.get('courseId')!=COURSE:continue
  source=old.get(lesson['id']);e=expected['lessons'].get(lesson['id'])
  if source is None or e is None:raise RuntimeError('Changed lesson membership: reconcile manually')
  patch={**e['patch'],'imageUrls':[*source.get('imageUrls',[]),e['imageUrl']],'imageAltTexts':{**source.get('imageAltTexts',{}),e['imageUrl']:e['imageAlt']}}
  if any(lesson.get(k)!=patch.get(k,source.get(k)) for k in FIELDS):raise RuntimeError('Post-release teaching edit: reconcile manually')
  for key in FIELDS:
   if key in source:lesson[key]=copy.deepcopy(source[key])
   else:lesson.pop(key,None)
 if {l['id'] for l in result['lessons'] if l.get('courseId')==COURSE}!=set(old) or sum(l.get('courseId')==COURSE for l in result['lessons'])!=36:raise RuntimeError('Changed lesson membership')
 course=next(c for c in result['courses'] if c['id']==COURSE)
 for key,value in {'courseVersion':'2.1.0','selfPaced':True,'topic':'Business','reviewPolicy':'source-checked-v1','lastReviewedAt':'2026-11-15'}.items():
  if course.get(key)!=value:raise RuntimeError('Post-release course edit: reconcile manually')
  if key in original['course']:course[key]=copy.deepcopy(original['course'][key])
  else:course.pop(key,None)
 # Keep every history entry. A future roll-forward requires a reconciled migration;
 # do not erase the applied marker just to force a replay.
 return result
if __name__=='__main__':
 if len(sys.argv)!=4:raise SystemExit('Usage: prepare-business-content-rollback.py OFFLINE_STORE EXPECTED_JSON NEW_OUTPUT_FILE')
 source,expected,target=map(pathlib.Path,sys.argv[1:]);assert not target.exists(),'Output already exists'
 result=prepare(json.loads(source.read_text()),json.loads(expected.read_text()))
 with target.open('x') as f:json.dump(result,f,indent=2,ensure_ascii=False);f.write('\n')
 target.chmod(0o600)
 print('Prepared separate compatible content store; learner files and source file untouched. Manual cutover requires the live app stopped.')
