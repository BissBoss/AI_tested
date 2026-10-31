// Gemini Free Tier adapter. Key is server-only; no OpenAI paid fallback.
const API='https://generativelanguage.googleapis.com/v1beta/models/';
export const generatorModel=()=>process.env.GEMINI_GENERATOR_MODEL||process.env.GEMINI_MODEL||'gemini-3.6-flash';
export const chatModel=()=>process.env.GEMINI_CHAT_MODEL||process.env.GEMINI_MODEL||'gemini-3.5-flash-lite';
export const verifierModel=()=>process.env.GEMINI_VERIFIER_MODEL||'gemini-3.5-flash-lite';
export const geminiConfigured=()=>Boolean(process.env.GEMINI_API_KEY&&process.env.STUDY_APP_PIN);
// responseSchema uses Gemini's Schema (OpenAPI-style), not full JSON Schema.
// Gemini's responseSchema rejects additionalProperties, including nested arrays/items.
// Remove that constraint only for the wire format; generator/verifier still validate
// returned questions and literal source evidence in application code.
export function toGeminiResponseSchema(value) {
 if (Array.isArray(value)) return value.map(toGeminiResponseSchema);
 if (value && typeof value === 'object') {
  const out={};
  for(const [key,child] of Object.entries(value)) {
   if(key === 'additionalProperties') continue;
   out[key]=toGeminiResponseSchema(child);
  }
  return out;
 }
 return value;
}
export async function invokeGemini({model,instructions,input,schema,max_output_tokens=5000}){
 if(!process.env.GEMINI_API_KEY)throw Error('Thiếu GEMINI_API_KEY trên Vercel.');
 if(!/^[a-zA-Z0-9_.-]+$/.test(model))throw Error('Tên model Gemini không hợp lệ.');
 const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),53000);
 try{
  const r=await fetch(API+encodeURIComponent(model)+':generateContent',{
   method:'POST',headers:{'x-goog-api-key':process.env.GEMINI_API_KEY,'Content-Type':'application/json'},
   body:JSON.stringify({
    systemInstruction:{parts:[{text:String(instructions||'')}]},
    contents:[{role:'user',parts:[{text:String(input||'')}]}],
    generationConfig:{responseMimeType:'application/json',responseSchema:toGeminiResponseSchema(schema),
      maxOutputTokens:Math.min(12000,Math.max(512,Number(max_output_tokens)||5000)),temperature:0.25}
   }),signal:ctl.signal
  });
  const data=await r.json().catch(()=>({}));
  if(!r.ok){
   const reason=String(data?.error?.message||('Gemini HTTP '+r.status)).slice(0,350);
   if(r.status===429)throw Error('Đã đạt hạn mức Gemini miễn phí. Thử lại sau hoặc giảm số câu. '+reason);
   if(r.status===403)throw Error('Gemini key/project chưa có quyền dùng model này. '+reason);
   if(r.status===400)throw Error('Gemini không chấp nhận yêu cầu hoặc schema. '+reason);
   if(r.status===404)throw Error('Model Gemini chưa khả dụng cho tài khoản. '+reason);
   throw Error(reason);
  }
  const output=(data.candidates||[]).flatMap(x=>x?.content?.parts||[]).map(p=>p?.text||'').join('').trim();
  if(!output)throw Error('Gemini không trả nội dung (giới hạn token hoặc bộ lọc).');
  try{return JSON.parse(output)}catch{throw Error('Gemini trả JSON không hợp lệ. Thử với ít câu hơn.')}
 }catch(e){if(e?.name==='AbortError')throw Error('Gemini phản hồi quá lâu. Thử lại với ít câu hơn.');throw e}
 finally{clearTimeout(timer)}
}
