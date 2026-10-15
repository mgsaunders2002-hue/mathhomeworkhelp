const $=id=>document.getElementById(id);
let grade='6',mode='hint',example=null,busy=false,revision=0;
const examples={
 '6':[
 {q:'The ratio of red to blue counters is 3 : 5. There are 40 counters altogether. How many are red?',answer:15,hint:'Imagine 3 equal parts for red and 5 for blue. How many equal parts are there altogether?',steps:'1. Draw 3 equal boxes for red and 5 for blue.\n2. There are 3 + 5 = 8 equal parts.\n3. Divide 40 by 8 to find how many counters each part represents.\n4. Multiply that amount by the 3 red parts.\nNow try it: how many red counters are there?',unit:'red counters'},
 {q:'A jacket costs $80. It is reduced by 25%. What is the sale price?',answer:60,hint:'25% is one quarter. Find one quarter of $80, then think about what the customer still pays.',steps:'1. Divide the original price into four equal parts.\n2. One part is the 25% discount.\n3. Subtract that discount from $80.\nTry it: what is the new price?',unit:'dollars'}],
 '8':[
 {q:'Solve for x: 3x + 7 = 28.',answer:7,hint:'An equation is like a balanced scale. What could you subtract from both sides first?',steps:'1. Subtract 7 from both sides: 3x = 21.\n2. Divide both sides by 3.\n3. Check by substituting your value into the original equation.\nWhat value of x makes both sides equal?',unit:''},
 {q:'A right triangle has shorter sides of 6 cm and 8 cm. Find the length of its hypotenuse.',answer:10,hint:'Use the Pythagorean theorem: a² + b² = c², with c as the hypotenuse.',steps:'1. Square the two shorter lengths: 6² = 36 and 8² = 64.\n2. Add: c² = 36 + 64.\n3. Take the positive square root to find a length.\nWhat is c? Include cm in your written working.',unit:'cm'}],
 '9':[
 {q:'Simplify: 2^3 × 2^4. Give your answer as a number.',answer:128,hint:'When multiplying powers with the same base, keep the base and add the exponents.',steps:'1. Keep the base 2.\n2. Add exponents: 3 + 4 = 7, so the expression becomes 2⁷.\n3. Evaluate 2⁷ by repeated multiplication.\nWhat number do you get?',unit:''},
 {q:'A rectangle has length (x + 4) cm and width 3 cm. Its perimeter is 26 cm. Find x.',answer:6,hint:'Use P = 2(length + width). Put the given lengths into that expression first.',steps:'1. Write 26 = 2((x + 4) + 3).\n2. Divide both sides by 2: 13 = x + 7.\n3. Isolate x by subtracting the same amount from each side.\nFind x, then check that the side lengths give a perimeter of 26 cm.',unit:''}]
};
const counts={'6':0,'8':0,'9':0};
function clearResult(){revision++;$('result').hidden=true;$('status').textContent='';}
function select(group,key,value){document.querySelectorAll(group).forEach(b=>{const selected=b.dataset[key]===value;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});clearResult();}
document.querySelectorAll('.grade').forEach(b=>b.onclick=()=>{grade=b.dataset.grade;example=null;$('question').value='';$('answer').value='';select('.grade','grade',grade);});
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;select('.mode','mode',mode);$('answerWrap').hidden=mode!=='check';});
function loadExample(){example=examples[grade][counts[grade]++%examples[grade].length];$('question').value=example.q;$('answer').value='';clearResult();$('question').focus();$('question').scrollIntoView({behavior:'smooth',block:'center'});}
['exampleButton','practiceButton','nextExample'].forEach(id=>$(id).onclick=loadExample);
$('question').oninput=()=>{example=null;clearResult();};$('answer').oninput=clearResult;
$('guideButton').onclick=()=>{const open=$('guide').hidden;$('guide').hidden=!open;$('guideButton').setAttribute('aria-expanded',String(open));};
function parseNumber(input){const text=input.trim().replace(/^\$/,'').replace(/\s*(cm|dollars|red counters|counters)$/i,'').trim();if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(text))return NaN;const parts=text.split('/').map(Number);return parts.length===2?parts[0]/parts[1]:parts[0];}
$('submit').onclick=async()=>{
 if(busy)return;
 const question=$('question').value.trim(),answer=$('answer').value.trim();
 if(!question){$('status').textContent='Type a question or choose a practice example first.';$('question').focus();return;}
 if(mode==='check'&&!answer){$('status').textContent='Add your answer so we can check it.';$('answer').focus();return;}
 clearResult();const current=revision;busy=true;$('submit').disabled=true;$('status').textContent='Thinking about your next step…';
 try{
 let text;
 if(example&&question===example.q){
  if(mode==='hint')text=example.hint;
  else if(mode==='explain')text=example.steps;
  else{const number=parseNumber(answer);text=Number.isFinite(number)?(Math.abs(number-example.answer)<1e-9?`Yes — your number is correct! The answer is ${example.answer}${example.unit?' '+example.unit:''}.\nCan you explain why your method works?`:`Not quite yet. Take another look:\n\n${example.steps}\n\nUse “Walk me through it” to work through the method, then try again.`):'For this practice example, enter your final number (decimals or fractions are fine). You can include cm or dollars. For example, write 3/4 rather than an unevaluated expression.';}
 }else{
  const response=await fetch('/api/help',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({grade,mode,question,answer}),signal:AbortSignal.timeout(55000)});
  let data;try{data=await response.json();}catch{throw new Error('Personal question help needs the app server. You can still try a practice example.');}
  if(!response.ok)throw new Error(data.error||'Please try again.');text=data.text;
 }
 if(current!==revision)return;
 $('feedback').textContent=text;$('result').hidden=false;$('result').focus();$('status').textContent='';
 }catch(err){if(current===revision)$('status').textContent=err.name==='TimeoutError'?'That took too long. Please try again.':err.message;}
 finally{busy=false;$('submit').disabled=false;}
};
fetch('/api/status').then(r=>r.json()).then(data=>{$('connection').textContent=data.ready?'AI help is connected. Explanations can make mistakes.':'Practice examples are ready. Personal question help awaits connection.';}).catch(()=>{$('connection').textContent='Practice examples are ready. Personal question help needs the app server.';});
