function formatDate(e){return e.toLocaleDateString("en-US",{month:"short",day:"numeric"})}function calculateDates(e){if(!e)return;let t=new Date,r=new Date,n=0,a=0;e.classList.contains("club-order")?(n=1,a=0):e.classList.contains("custom-print")&&(n=2,a=1);let s=new Date(t);s.setDate(t.getDate()+(12>t.getHours()?n:n+1));let i=new Date(s);i.setDate(s.getDate()+1);let o=new Date(s);o.setDate(s.getDate()+4+a);let l=new Date(s);l.setDate(s.getDate()+5+a),e.querySelector("#ordertoday").innerText=formatDate(r),e.querySelector("#orderready").innerText=`${formatDate(s)} - ${formatDate(i)}`,e.querySelector("#orderdelivery").innerText=`${formatDate(o)} - ${formatDate(l)}`}function observeDynamicCt(){let e=document.body,t=function(e){for(let t of e)t.addedNodes.forEach(e=>{1===e.nodeType&&(e.classList.contains("order-delivery")&&calculateDates(e),e.querySelectorAll(".order-delivery").forEach(e=>calculateDates(e)))})},r=new MutationObserver(t);r.observe(e,{childList:!0,subtree:!0})}function initializeOrderTimer(){let e=new Date,t=e.getHours();e.getMinutes();let r=e.getDay(),n,a,s=new Date(e.getFullYear(),e.getMonth(),e.getDate(),12,0,0);if(6===r&&t>=12&&t<24){let i=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1,0,0,0);n=i,a=`
      Order within <span class="tmr-hour">{hours}</span>  
      <span class="tmr-minute">{minutes}</span> for 
      <span class="tmr-tdy">One-day Dispatch*</span>
    `}else if(0===r)n=new Date(s.getTime()+864e5),a=`
      Order within <span class="tmr-hour">{hours}</span>  
      <span class="tmr-minute">{minutes}</span> for 
      <span class="tmr-tdy">Next-day Dispatch*</span>
    `;else if(t<12)n=s,a=`
      Order within <span class="tmr-hour">{hours}</span>  
      <span class="tmr-minute">{minutes}</span> for 
      <span class="tmr-tdy">Same-day Dispatch*</span>
    `;else if(t>=12&&t<24){let o=new Date(s.getTime()+864e5);n=new Date(o.setHours(0,0,0,0)),a=`
      Order within <span class="tmr-hour">{hours}</span>  
      <span class="tmr-minute">{minutes}</span> for 
      <span class="tmr-tdy">Next-day Dispatch*</span>
    `}function l(){let e=new Date,t=n-e;if(t>0){let r=Math.floor(t/36e5%24),s=Math.floor(t/6e4%60),i=a;i=i.replace("{hours}",r>0?`${r} ${1===r?"hr":"hrs"}`:"").replace("{minutes}",s>0?`${s} ${1===s?"min":"mins"}`:"");let o=document.querySelectorAll("#order-message");o.forEach(e=>{e.innerHTML=i.trim()})}else location.reload()}setInterval(l,1e3),l()}function observeDynamicContent(){let e=document.body,t=function(e){for(let t of e)if("childList"===t.type){let r=t.target.querySelector("#order-timer");r&&initializeOrderTimer()}},r=new MutationObserver(t);r.observe(e,{childList:!0,subtree:!0})}document.querySelectorAll(".order-delivery").forEach(e=>calculateDates(e)),observeDynamicCt(),initializeOrderTimer(),observeDynamicContent(),window.addEventListener("load",function(){setTimeout(function(){document.querySelectorAll(".product-customize-atcc").forEach(function(e){e.classList.remove("hidden")})},3750)});