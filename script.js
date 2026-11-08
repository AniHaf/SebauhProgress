const menuToggle=document.getElementById("menuToggle");
const mainNav=document.getElementById("mainNav");
menuToggle?.addEventListener("click",()=>mainNav.classList.toggle("open"));
mainNav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>mainNav.classList.remove("open")));

function openLightboxFromImage(image){
  const box=document.getElementById("lightbox");
  const target=document.getElementById("lightboxImage");
  target.src=image.currentSrc || image.src;
  target.alt=image.alt || "Project photograph";
  box.classList.add("show");
  document.body.style.overflow="hidden";
}
function openLightbox(image){openLightboxFromImage(image);}
function closeLightbox(){
  document.getElementById("lightbox").classList.remove("show");
  document.body.style.overflow="";
}

/* Make every page photograph clickable, including the hero image. */
document.querySelectorAll("main img").forEach(img=>{
  img.tabIndex=0;
  img.setAttribute("role","button");
  img.setAttribute("aria-label",(img.alt || "Project photograph") + " — click to enlarge");
  img.addEventListener("click",()=>openLightboxFromImage(img));
  img.addEventListener("keydown",event=>{
    if(event.key==="Enter" || event.key===" "){event.preventDefault();openLightboxFromImage(img);}
  });
});

document.getElementById("presentationToggle")?.addEventListener("click",()=>{
  document.body.classList.toggle("presentation-mode");
  const active=document.body.classList.contains("presentation-mode");
  document.getElementById("presentationToggle").textContent=active?"Exit presentation view ⤢":"Presentation view ⛶";
});
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeLightbox();});
