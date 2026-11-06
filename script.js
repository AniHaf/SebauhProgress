
// Keep every original image filename exactly as supplied. Place the files in /images/.
const photoData = {
  church: [
    ...['PecahTanah.jpeg','PecahTanah2.jpeg','PecahTanah3.jpeg','PecahTanah4.jpeg','PecahTanah5.jpeg','PecahTanah6.jpeg'].map((name,i)=>({name,category:'ceremony',label:`Groundbreaking & blessing · Photo ${i+1}`})),
    ...['Church.jpeg','Church2.jpeg','Church3.jpeg','Church4.jpeg','Church5.jpeg','Church6.jpeg'].map((name,i)=>({name,category:'ceremony',label:`Church ceremony · Photo ${i+1}`})),
    ...['ChurchProgress','ChurchProgress2','ChurchProgress3','ChurchProgress4'].map((name,i)=>({name,category:'progress',label:`Construction progress · Photo ${i+1} · 29 Sep 2026`}))
  ],
  mosque: [
    ...['Masjid.jpg','Masjid2.jpg','Masjid3.jpg'].map((name,i)=>({name,category:'visit',label:`Site visit · Photo ${i+1} · 3 Mar 2026`})),
    ...['MasjidProgress','MasjidProgress2','MasjidProgress3'].map((name,i)=>({name,category:'progress',label:`Construction progress · Photo ${i+1} · 4 Nov 2026`}))
  ],
  mrp: ['MRP.jpg','MRP2.jpg','MRP3.jpg','MRP4.jpg'].map((name,i)=>({name,category:'mrp',label:`Community presentation · Photo ${i+1} · 26 Jun 2026`}))
};

const extensions=['.jpeg','.jpg','.png','.webp','.JPEG','.JPG','.PNG','.WEBP'];

function imageCandidates(name) {
  return /\.(jpeg|jpg|png|webp)$/i.test(name)
    ? [`images/${name}`]
    : extensions.map(ext => `images/${name}${ext}`);
}

function loadImage(img,name,onMissing){
  const paths=imageCandidates(name);let index=0;
  img.onerror=()=>{index++;if(index<paths.length){img.src=encodeURI(paths[index]);return;}img.onerror=null;if(onMissing)onMissing();};
  img.src=encodeURI(paths[0]);
}

let activePhotos=[],activeIndex=0;

function openPhoto(group,index){
  activePhotos=photoData[group].filter(photo=>!photo.missing);
  activeIndex=activePhotos.findIndex(photo=>photo.name===photoData[group][index].name);
  if(activeIndex<0)return;
  const box=document.getElementById('lightbox');box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';showPhoto();
}

function showPhoto(){
  const photo=activePhotos[activeIndex];if(!photo)return;
  const img=document.getElementById('lbImg');loadImage(img,photo.name,()=>{});
  img.alt=photo.label;document.getElementById('lbTitle').textContent=photo.label;
  document.getElementById('lbCount').textContent=`${activeIndex+1} / ${activePhotos.length}`;
}

function movePhoto(step){if(!activePhotos.length)return;activeIndex=(activeIndex+step+activePhotos.length)%activePhotos.length;showPhoto();}

function closePhoto(){const box=document.getElementById('lightbox');box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';}

for(const group of Object.keys(photoData)){
  const gallery=document.getElementById(`gallery-${group}`);
  photoData[group].forEach((photo,index)=>{
    const button=document.createElement('button');button.className='photo';button.type='button';button.dataset.category=photo.category;button.setAttribute('aria-label',`View ${photo.label}`);
    const figure=document.createElement('figure');const img=document.createElement('img');img.loading='lazy';img.alt=photo.label;
    loadImage(img,photo.name,()=>{photo.missing=true;const missing=document.createElement('div');missing.className='missing';missing.textContent=`Image not found: ${photo.name}`;img.replaceWith(missing);});
    const caption=document.createElement('figcaption');caption.textContent=photo.label;figure.append(img,caption);button.append(figure);button.addEventListener('click',()=>openPhoto(group,index));gallery.append(button);
  });
}

document.querySelectorAll('.filters').forEach(bar=>bar.addEventListener('click',event=>{
  const button=event.target.closest('button[data-filter]');if(!button)return;
  bar.querySelectorAll('button').forEach(item=>item.classList.toggle('active',item===button));
  const group=bar.dataset.gallery;
  document.querySelectorAll(`#gallery-${group} .photo`).forEach(photo=>photo.hidden=button.dataset.filter!=='all'&&photo.dataset.category!==button.dataset.filter);
}));

document.getElementById('lbClose').addEventListener('click',closePhoto);
document.getElementById('lbPrev').addEventListener('click',()=>movePhoto(-1));
document.getElementById('lbNext').addEventListener('click',()=>movePhoto(1));
document.getElementById('lightbox').addEventListener('click',event=>{if(event.target.id==='lightbox')closePhoto();});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape')closePhoto();
  if(document.getElementById('lightbox').classList.contains('open')){if(event.key==='ArrowLeft')movePhoto(-1);if(event.key==='ArrowRight')movePhoto(1);}
});

document.getElementById('present').addEventListener('click',()=>{
  document.body.classList.toggle('presentation');
  if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});
  else document.exitFullscreen?.();
});

document.getElementById('menu').addEventListener('click',()=>document.querySelector('.main-nav').classList.toggle('open'));
document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.main-nav').classList.remove('open')));

// Use supplied project photographs for the hero and overview thumbnails.
const hero=document.getElementById('heroImage');
const heroImage=new Image();

loadImage(heroImage,'ChurchProgress',()=>{
  const fallback=new Image();loadImage(fallback,'MasjidProgress',()=>{});
  fallback.onload=()=>hero.style.backgroundImage=`url("${fallback.src}")`;
});

heroImage.onload=()=>hero.style.backgroundImage=`url("${heroImage.src}")`;

for(const [group,file] of [['church','ChurchProgress'],['mosque','MasjidProgress'],['mrp','MRP.jpg']]){
  const element=document.querySelector(`[data-preview="${group}"]`);const image=new Image();
  loadImage(image,file,()=>{});image.onload=()=>element.style.backgroundImage=`url("${image.src}")`;
}
