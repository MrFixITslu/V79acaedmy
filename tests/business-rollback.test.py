import importlib.util,json,copy,pathlib
spec=importlib.util.spec_from_file_location('rollback','scripts/prepare-business-content-rollback.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
expected=json.loads(pathlib.Path('docs/curriculum-audit/business-expected.json').read_text())
old={'courses':[{'id':m.COURSE,'courseVersion':'2.0.0','status':'Published','price':0}],'lessons':[{'id':key,'courseId':m.COURSE,'lessonContent':'Original teaching '+key,'imageUrls':['/original.svg'],'unknown':'keep'} for key in expected['lessons']]+[{'id':'other-lesson','courseId':'other-course','lessonContent':'Unchanged'}],'publishingLogs':[{'id':'prior-log'}]}
cid=m.COURSE;lessons=[l for l in old['lessons'] if l['courseId']==cid];course=next(c for c in old['courses'] if c['id']==cid)
current=copy.deepcopy(old);snapshot={'course':copy.deepcopy(course),'lessons':copy.deepcopy(lessons)}
current.setdefault('courseVersions',[]).append({'id':'ita-before-self-study-v2-1','snapshot':snapshot})
for l in current['lessons']:
 if l['id'] in expected['lessons']:
  e=expected['lessons'][l['id']];l.update(e['patch']);l['imageUrls']=[*l.get('imageUrls',[]),e['imageUrl']];l['imageAltTexts']={**l.get('imageAltTexts',{}),e['imageUrl']:e['imageAlt']}
next(c for c in current['courses'] if c['id']==cid).update(courseVersion='2.1.0',selfPaced=True,topic='Business',reviewPolicy='source-checked-v1',lastReviewedAt='2026-11-15')
current['learnerSentinel']={'progress':'preserve'}
r=m.prepare(current,expected)
assert r['lessons']==old['lessons'];assert r['courses']==old['courses'];assert r['learnerSentinel']==current['learnerSentinel'];assert r['courseVersions']==current['courseVersions']
for key in ['lessonContent','studySolution','imageAltTexts']:
 edited=copy.deepcopy(current);next(l for l in edited['lessons'] if l['id']=='ita-les-1-1')[key]='Administrator edit'
 try:m.prepare(edited,expected)
 except RuntimeError:pass
 else:raise AssertionError('Must refuse post-release edit')
print('Content rollback: complete prior teaching/course metadata, other records/history preserved, edited content refused.')
# Exercise the operator guard with fake Docker calls: an incompatible rollback
# must be refused before stopping or renaming any live container.
import ast,tempfile,subprocess
fn=next(x for x in ast.parse(pathlib.Path('scripts/release-business.py').read_text()).body if isinstance(x,ast.FunctionDef) and x.name=='rollback')
with tempfile.TemporaryDirectory() as tmp:
 p=pathlib.Path(tmp);calls=[]
 env={'pathlib':pathlib,'json':json,'sp':subprocess,'OLD':'retained-old','LIVE':'live','out':lambda a:'retained-old\nlive\n','inspect':lambda n:{'Mounts':[{'Source':tmp,'Destination':'/app/data'}]},'run':lambda a,**kw:calls.append(a),'wait':lambda n:None}
 exec(compile(ast.Module(body=[fn],type_ignores=[]),'rollback-guard','exec'),env)
 (p/'store.json').write_text(json.dumps(current))
 try:env['rollback']()
 except RuntimeError as e:assert 'compatible business content' in str(e)
 else:raise AssertionError('Must refuse old-image rollback before content compatibility')
 assert calls==[]
 (p/'store.json').write_text(json.dumps(r));env['rollback']();assert any(a[:2]==['docker','start'] for a in calls)
print('Operator rollback guard: refused incompatible content before Docker mutation; compatible restoration allowed.')
