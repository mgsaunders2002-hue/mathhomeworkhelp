import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const port=3100+Math.floor(Math.random()*1000);
const proc=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:String(port),OPENAI_API_KEY:'',OPENAI_MODEL:''},stdio:'ignore'});
after(()=>proc.kill());
const base=`http://127.0.0.1:${port}`;
async function ready(){for(let i=0;i<40;i++){try{return await fetch(base);}catch{await new Promise(r=>setTimeout(r,50));}}throw Error('server did not start');}
test('page and scripts load; secrets and arbitrary paths stay inaccessible',async()=>{const page=await ready();assert.equal(page.status,200);assert.match(await page.text(),/Maths, Together/);assert.match(page.headers.get('content-security-policy'),/frame-ancestors 'none'/);for(const path of ['/app.js','/style.css'])assert.equal((await fetch(base+path)).status,200);for(const path of ['/server.mjs','/.env','/package.json'])assert.equal((await fetch(base+path)).status,404);});
test('missing API configuration is explicit, without fabricated feedback',async()=>{await ready();assert.deepEqual(await(await fetch(base+'/api/status')).json(),{ready:false});const r=await fetch(base+'/api/help',{method:'POST',body:JSON.stringify({question:'2+2'})});assert.equal(r.status,503);assert.match((await r.json()).error,/not connected/);});
