const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../welcome.js'),'utf8');
function visit({session=new Map(),host,blocked=false,decided=true}={}){
  let opens=0;
  const dialog={showModal(){opens++;},querySelectorAll(){return [];},addEventListener(){}};
  const window={location:{origin:'https://example.test'},CeyhaniCookies:{decided:()=>decided},sessionStorage:{
    getItem(key){if(blocked)throw Error('blocked');return session.get(key)??null;},
    setItem(key,value){if(blocked)throw Error('blocked');session.set(key,value);}
  }};
  window.top=host??window;
  const run=()=>vm.runInNewContext(source,{window,document:{querySelector:()=>dialog}});
  run();
  return {opens:()=>opens,window,run};
}
test('returning home or reloading in the same tab does not reopen the popup',()=>{
  const session=new Map();
  const first=visit({session});assert.equal(first.opens(),1);
  first.run();assert.equal(first.opens(),1);
  assert.equal(visit({session}).opens(),0);
});
test('a fresh session shows the popup once',()=>{
  assert.equal(visit().opens(),1);
  assert.equal(visit().opens(),1);
});
test('waiting for cookie preferences does not consume the first welcome display',()=>{
  const session=new Map();assert.equal(visit({session,decided:false}).opens(),0);
  assert.equal(session.size,0);assert.equal(visit({session}).opens(),1);
});
test('blocked storage still remembers the welcome across navigation frames',()=>{
  const first=visit({blocked:true});assert.equal(first.opens(),1);
  assert.equal(visit({blocked:true,host:first.window}).opens(),0);
});
