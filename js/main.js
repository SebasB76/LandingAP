const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

const API_BASE = "https://6a39ebee917c7b14c74c751b.mockapi.io";

const eventsGrid = document.getElementById("events-grid");
const eventsFilters = document.getElementById("events-filters");
const testimonialsGrid = document.getElementById("testimonials-grid");
const heroPreview = document.getElementById("hero-preview");

let allEvents = [];
let activeFilter = "Todos";

function normalize(value) {
  return (value || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function escapeHtml(value) {
  return (value == null ? "" : String(value))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ICONS = {
  hackaton: '<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25M6.75 17.25 1.5 12l5.25-5.25m7.5-9-4.5 16.5" />',
  pasantia: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />',
  charla: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />',
  concurso: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />',
  default: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />',
};

function typeKey(type) {
  const t = normalize(type);
  if (t.includes("hack")) return "hackaton";
  if (t.includes("pasant")) return "pasantia";
  if (t.includes("charla")) return "charla";
  if (t.includes("concurso")) return "concurso";
  return "default";
}

function iconFor(type) {
  return ICONS[typeKey(type)] || ICONS.default;
}

function renderEventCard(ev) {
  return `
    <article class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200 p-6 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        ${ev.img
          ? `<span class="w-11 h-11 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
              <img src="${escapeHtml(ev.img)}" alt="${escapeHtml(ev.title)}" class="w-7 h-7 object-contain" />
            </span>`
          : `<span class="w-11 h-11 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">${iconFor(ev.type)}</svg>
            </span>`}
        <span class="mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">${escapeHtml(ev.type) || "Evento"}</span>
      </div>
      <h3 class="text-lg font-bold text-slate-900">${escapeHtml(ev.title)}</h3>
      <p class="mt-2 text-sm text-slate-600 flex-grow">${escapeHtml(ev.description)}</p>
      <div class="mt-5 flex items-center justify-between">
        <span class="text-xs text-slate-500">${escapeHtml(ev.date)}</span>
        <a href="${encodeURI(ev.url || "#")}" target="_blank" rel="noopener" class="text-sm font-semibold text-brand-600 hover:text-brand-700">Ver más &rarr;</a>
      </div>
    </article>`;
}

function renderHeroPreview() {
  if (!heroPreview) return;
  const preview = allEvents.slice(0, 3);
  if (preview.length === 0) return;
  heroPreview.innerHTML = preview.map((ev, index) => `
    <div class="flex items-center gap-3 p-3 rounded-xl ${index === 0 ? "bg-brand-50" : "bg-slate-50"}">
      ${ev.img
        ? `<span class="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
            <img src="${escapeHtml(ev.img)}" alt="${escapeHtml(ev.title)}" class="w-6 h-6 object-contain" />
          </span>`
        : `<span class="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">${iconFor(ev.type)}</svg>
          </span>`}
      <div class="min-w-0">
        <p class="text-sm font-semibold text-slate-800 truncate">${escapeHtml(ev.title)}</p>
        <p class="text-xs text-slate-500 truncate">${escapeHtml(ev.type)}${ev.date ? " · " + escapeHtml(ev.date) : ""}</p>
      </div>
    </div>`).join("");
}

function renderEvents() {
  const list = activeFilter === "Todos"
    ? allEvents
    : allEvents.filter((ev) => typeKey(ev.type) === typeKey(activeFilter));

  if (list.length === 0) {
    eventsGrid.innerHTML = '<p class="text-slate-400 col-span-full">No hay eventos en esta categoría todavía.</p>';
    return;
  }
  eventsGrid.innerHTML = list.map(renderEventCard).join("");
}

function renderFilters() {
  const types = ["Todos", "Hackatón", "Pasantía", "Charla"];
  eventsFilters.innerHTML = types.map((type) => {
    const isActive = type === activeFilter;
    const classes = isActive
      ? "bg-brand-600 text-white border-brand-600"
      : "bg-white text-slate-600 border-slate-300 hover:border-brand-600 hover:text-brand-600";
    return `<button data-filter="${type}" class="mono px-4 py-1.5 rounded-full text-xs uppercase tracking-wider border transition ${classes}">${type}</button>`;
  }).join("");

  eventsFilters.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      renderFilters();
      renderEvents();
    });
  });
}

async function loadEvents() {
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error("Respuesta no válida");
    allEvents = await res.json();
    renderHeroPreview();
    renderFilters();
    renderEvents();
  } catch (error) {
    eventsGrid.innerHTML = '<p class="text-red-500 col-span-full">No pudimos cargar los eventos. Intenta de nuevo más tarde.</p>';
  }
}

function renderTestimonialCard(t) {
  const initial = escapeHtml((t.name || "?").trim().charAt(0).toUpperCase());
  return `
    <article class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
      <p class="text-slate-600 leading-relaxed flex-grow">&ldquo;${escapeHtml(t.experience)}&rdquo;</p>
      <div class="mt-5 flex items-center gap-3 pt-5 border-t border-slate-100">
        <span class="w-11 h-11 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">${initial}</span>
        <div>
          <p class="font-semibold text-slate-900">${escapeHtml(t.name) || "Anónimo"}</p>
          <p class="text-xs text-slate-500">${escapeHtml(t.college)}${t.eventType ? " · " + escapeHtml(t.eventType) : ""}</p>
        </div>
      </div>
    </article>`;
}

async function loadTestimonials() {
  try {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error("Respuesta no válida");
    const testimonials = await res.json();
    if (testimonials.length === 0) {
      testimonialsGrid.innerHTML = '<p class="text-slate-400 col-span-full">Sé el primero en compartir tu experiencia.</p>';
      return;
    }
    testimonialsGrid.innerHTML = testimonials.slice().reverse().map(renderTestimonialCard).join("");
  } catch (error) {
    testimonialsGrid.innerHTML = '<p class="text-red-500 col-span-full">No pudimos cargar los testimonios. Intenta de nuevo más tarde.</p>';
  }
}

const form = document.getElementById("testimonial-form");
const submitBtn = document.getElementById("submit-btn");
const formMessage = document.getElementById("form-message");

function showMessage(text, ok) {
  formMessage.textContent = text;
  formMessage.classList.remove("hidden", "text-brand-700", "text-red-500");
  formMessage.classList.add(ok ? "text-brand-700" : "text-red-500");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const body = {
    name: data.get("name"),
    college: data.get("college"),
    eventType: data.get("eventType"),
    experience: data.get("experience"),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Publicando…";

  try {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Error al publicar");

    form.reset();
    showMessage("¡Gracias! Tu experiencia ya está en el muro.", true);
    loadTestimonials();
    document.getElementById("muro").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    showMessage("Algo salió mal. Vuelve a intentarlo.", false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publicar mi experiencia";
  }
});

loadEvents();
loadTestimonials();

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}
