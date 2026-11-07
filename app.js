// BarberAI Main Application Logic

// Initial State & Data
const state = {
    barbers: [
        { id: 'carlos', name: 'Carlos Mendoza', role: 'Master Barber', color: 'emerald' },
        { id: 'mateo', name: 'Mateo Restrepo', role: 'Estilista & Barba', color: 'indigo' },
        { id: 'andres', name: 'Andrés Silva', role: 'Especialista Fade', color: 'amber' }
    ],
    services: [
        { id: 'corte', name: 'Corte de Cabello Tradicional', price: 25000, duration: '30 min' },
        { id: 'barba', name: 'Perfilado y Rito de Barba', price: 18000, duration: '25 min' },
        { id: 'combo', name: 'Combo VIP (Corte + Barba)', price: 38000, duration: '50 min' },
        { id: 'tinte', name: 'Color / Pigmentación', price: 45000, duration: '60 min' }
    ],
    appointments: [
        { id: 'APT-101', client: 'Juan Camilo Pérez', phone: '300 123 4567', service: 'Combo VIP (Corte + Barba)', barber: 'carlos', time: '09:00 AM', price: 38000, status: 'Confirmada' },
        { id: 'APT-102', client: 'Santiago Gómez', phone: '312 987 6543', service: 'Corte de Cabello Tradicional', barber: 'mateo', time: '10:30 AM', price: 25000, status: 'Completada' },
        { id: 'APT-103', client: 'Felipe Valencia', phone: '315 456 7890', service: 'Perfilado y Rito de Barba', barber: 'andres', time: '02:00 PM', price: 18000, status: 'Confirmada' }
    ],
    chatStep: 'IDLE',
    bookingDraft: {}
};

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const timelineContainer = document.getElementById('timeline-container');
const tableBody = document.getElementById('table-body');
const filterSearch = document.getElementById('filter-search');

// View Toggle Buttons
const tabTimeline = document.getElementById('tab-timeline');
const tabTable = document.getElementById('tab-table');
const viewTimeline = document.getElementById('view-timeline');
const viewTable = document.getElementById('view-table');

// Modal Elements
const btnAcaModal = document.getElementById('btn-aca-modal');
const modalAca = document.getElementById('modal-aca');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseModalFooter = document.getElementById('btn-close-modal-footer');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initChatWelcome();
    renderDashboard();
    setupEventListeners();
});

// Initial Welcome Chat Message
function initChatWelcome() {
    appendBotMessage(`👋 ¡Hola! Soy **BarberAI**, el asistente inteligente de la barbería.

¿En qué puedo ayudarte hoy?
• ✂️ *Agendar una cita*
• 💵 *Consultar lista de precios*
• 📅 *Ver disponibilidad de barberos*`);
}

// Event Listeners Setup
function setupEventListeners() {
    // Chat submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        
        appendUserMessage(msg);
        chatInput.value = '';
        processUserInput(msg);
    });

    // Chip buttons
    document.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg');
            appendUserMessage(msg);
            processUserInput(msg);
        });
    });

    // View Switcher
    tabTimeline.addEventListener('click', () => {
        tabTimeline.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white transition-all shadow-md';
        tabTable.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all';
        viewTimeline.classList.remove('hidden');
        viewTable.classList.add('hidden');
    });

    tabTable.addEventListener('click', () => {
        tabTable.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white transition-all shadow-md';
        tabTimeline.className = 'px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all';
        viewTable.classList.remove('hidden');
        viewTimeline.classList.add('hidden');
    });

    // Search filter
    filterSearch.addEventListener('input', (e) => {
        renderDashboard(e.target.value.toLowerCase());
    });

    // Reset Chat button
    document.getElementById('btn-reset-chat').addEventListener('click', () => {
        chatContainer.innerHTML = '';
        state.chatStep = 'IDLE';
        state.bookingDraft = {};
        initChatWelcome();
    });

    // ACA Modal Controls
    btnAcaModal.addEventListener('click', () => modalAca.classList.remove('hidden'));
    btnCloseModal.addEventListener('click', () => modalAca.classList.add('hidden'));
    btnCloseModalFooter.addEventListener('click', () => modalAca.classList.add('hidden'));

    // Manual appointment button
    document.getElementById('btn-nueva-cita-manual').addEventListener('click', () => {
        const name = prompt('Nombre del cliente:');
        if (!name) return;
        const newApt = {
            id: `APT-${Math.floor(100 + Math.random() * 900)}`,
            client: name,
            phone: '300 000 0000',
            service: 'Corte de Cabello Tradicional',
            barber: 'carlos',
            time: '04:00 PM',
            price: 25000,
            status: 'Confirmada'
        };
        state.appointments.push(newApt);
        renderDashboard();
    });
}

// User Message Rendering
function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg-user max-w-[82%] px-3.5 py-2.5 text-xs leading-relaxed self-end mb-2';
    div.innerText = text;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Bot Message Rendering with Simulated Typing Indicator (RNF02)
function appendBotMessage(text, callback) {
    showTypingIndicator();
    
    // Simulate AI latency (1.2 seconds)
    setTimeout(() => {
        removeTypingIndicator();
        const div = document.createElement('div');
        div.className = 'chat-msg-bot max-w-[85%] px-3.5 py-2.5 text-xs leading-relaxed self-start mb-2';
        
        // Convert simple markdown bold and lists
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        div.innerHTML = formatted;
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        if (callback) callback();
    }, 1200);
}

function showTypingIndicator() {
    removeTypingIndicator();
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'chat-msg-bot px-4 py-3 self-start mb-2 flex items-center space-x-1.5';
    div.innerHTML = `
        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></span>
        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></span>
        <span class="w-1.5 h-1.5 bg-slate-400 rounded-full typing-dot"></span>
    `;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const existing = document.getElementById('typing-indicator');
    if (existing) existing.remove();
}

// Simulated NLP Intent Processing Engine (RF01)
function processUserInput(input) {
    const lower = input.toLowerCase();

    // Check reset intent
    if (lower.includes('inicio') || lower.includes('cancelar proceso')) {
        state.chatStep = 'IDLE';
        state.bookingDraft = {};
        appendBotMessage('Proceso reiniciado. ¿En qué más puedo colaborarte?');
        return;
    }

    // Step-by-step state machine
    if (state.chatStep === 'AWAITING_BARBER') {
        let selectedBarber = state.barbers.find(b => lower.includes(b.name.toLowerCase()) || lower.includes(b.id));
        if (!selectedBarber && lower.includes('1')) selectedBarber = state.barbers[0];
        if (!selectedBarber && lower.includes('2')) selectedBarber = state.barbers[1];
        if (!selectedBarber && lower.includes('3')) selectedBarber = state.barbers[2];

        if (selectedBarber) {
            state.bookingDraft.barber = selectedBarber.id;
            state.chatStep = 'AWAITING_SERVICE';
            appendBotMessage(`Excelente, trabajarás con **${selectedBarber.name}**.

Por favor dime qué servicio deseas:
1. *Corte Tradicional* ($25.000)
2. *Perfilado de Barba* ($18.000)
3. *Combo VIP* ($38.000)`);
        } else {
            appendBotMessage('Por favor selecciona una opción válida de barbero (1, 2 o 3).');
        }
        return;
    }

    if (state.chatStep === 'AWAITING_SERVICE') {
        let selectedService = state.services[0];
        if (lower.includes('barba') || lower.includes('2')) selectedService = state.services[1];
        if (lower.includes('combo') || lower.includes('3')) selectedService = state.services[2];

        state.bookingDraft.service = selectedService.name;
        state.bookingDraft.price = selectedService.price;
        state.chatStep = 'AWAITING_TIME';

        appendBotMessage(`¡Entendido! Servicio: **${selectedService.name}**.

Escribe la hora deseada para mañana (Ej: *03:00 PM*, *05:30 PM*):`);
        return;
    }

    if (state.chatStep === 'AWAITING_TIME') {
        state.bookingDraft.time = input.toUpperCase();
        state.chatStep = 'CONFIRMING';

        const barberObj = state.barbers.find(b => b.id === state.bookingDraft.barber);
        appendBotMessage(`Resumen de tu agendamiento:

• **Cliente:** Usuario WhatsApp
• **Barbero:** ${barberObj.name}
• **Servicio:** ${state.bookingDraft.service}
• **Hora:** ${state.bookingDraft.time}
• **Total:** $${state.bookingDraft.price.toLocaleString('es-CO')}

¿Deseas **confirmar** la reserva? (Responde *Sí* o *No*)`);
        return;
    }

    if (state.chatStep === 'CONFIRMING') {
        if (lower.includes('sí') || lower.includes('si') || lower.includes('confirmar')) {
            const barberObj = state.barbers.find(b => b.id === state.bookingDraft.barber);
            const newAppointment = {
                id: `APT-${Math.floor(100 + Math.random() * 900)}`,
                client: 'Usuario WhatsApp',
                phone: '300 888 9911',
                service: state.bookingDraft.service,
                barber: state.bookingDraft.barber,
                time: state.bookingDraft.time,
                price: state.bookingDraft.price,
                status: 'Confirmada'
            };

            state.appointments.push(newAppointment);
            state.chatStep = 'IDLE';
            state.bookingDraft = {};

            renderDashboard();

            appendBotMessage(`✅ **¡Cita Agendada Exitosamente!**

Hemos registrado tu espacio en el sistema de la barbería. Te enviaremos un recordatorio por WhatsApp 2 horas antes de tu turno.`);
        } else {
            state.chatStep = 'IDLE';
            state.bookingDraft = {};
            appendBotMessage('Reserva cancelada. Escribe cuando desees intentarlo de nuevo.');
        }
        return;
    }

    // Default NLP Keyword Matching
    if (lower.includes('agendar') || lower.includes('cita') || lower.includes('reserva')) {
        state.chatStep = 'AWAITING_BARBER';
        appendBotMessage(`¡Claro que sí! Con gusto te agendo.

¿Con qué barbero te gustaría atenderte?
1. 💈 **Carlos Mendoza** (Master)
2. ✂️ **Mateo Restrepo** (Barba/Estilo)
3. 🔥 **Andrés Silva** (Especialista Fade)`);
    } else if (lower.includes('precio') || lower.includes('costo') || lower.includes('servicio')) {
        let msg = `💈 **Nuestra Carta de Servicios:**

`;
        state.services.forEach(s => {
            msg += `• **${s.name}**: $${s.price.toLocaleString('es-CO')} (${s.duration})
`;
        });
        msg += `
¿Deseas agendar alguno de estos servicios?`;
        appendBotMessage(msg);
    } else if (lower.includes('disponibilidad') || lower.includes('horario')) {
        appendBotMessage(`📅 **Horarios Disponibles para Hoy:**

• Carlos Mendoza: 03:00 PM, 04:30 PM
• Mateo Restrepo: 02:00 PM, 05:00 PM
• Andrés Silva: 06:00 PM

¿Cuál horario prefieres?`);
    } else {
        appendBotMessage(`Entendido. Puedes decirme si deseas **agendar una cita**, **ver la lista de precios** o **consultar disponibilidad**.`);
    }
}

// Render Dashboard (Timeline & Table)
function renderDashboard(searchTerm = '') {
    const filtered = state.appointments.filter(a => 
        a.client.toLowerCase().includes(searchTerm) || 
        a.service.toLowerCase().includes(searchTerm) ||
        a.id.toLowerCase().includes(searchTerm)
    );

    // Render Timeline View
    timelineContainer.innerHTML = '';
    state.barbers.forEach(barber => {
        const barberApts = filtered.filter(a => a.barber === barber.id);
        const col = document.createElement('div');
        col.className = 'bg-slate-900/80 rounded-xl p-3 border border-slate-700/80 flex flex-col space-y-3';
        
        col.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-700/60 pb-2">
                <div>
                    <h4 class="font-bold text-xs text-white">${barber.name}</h4>
                    <p class="text-[10px] text-slate-400">${barber.role}</p>
                </div>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    ${barberApts.length} Citas
                </span>
            </div>
            <div class="space-y-2 flex-1">
                ${barberApts.length === 0 ? '<p class="text-[11px] text-slate-500 italic py-4 text-center">Sin citas asignadas</p>' : ''}
                ${barberApts.map(apt => `
                    <div class="bg-slate-800 p-2.5 rounded-lg border border-slate-700/80 shadow-sm hover:border-emerald-500/50 transition-colors">
                        <div class="flex items-center justify-between text-[11px] font-semibold text-emerald-400 mb-1">
                            <span><i class="fa-regular fa-clock mr-1"></i>${apt.time}</span>
                            <span class="text-[9px] px-1.5 py-0.2 rounded ${apt.status === 'Completada' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}">${apt.status}</span>
                        </div>
                        <h5 class="text-xs font-bold text-slate-100">${apt.client}</h5>
                        <p class="text-[10px] text-slate-400">${apt.service}</p>
                        <div class="mt-2 pt-1.5 border-t border-slate-700/50 flex justify-between items-center text-[10px]">
                            <span class="font-semibold text-amber-400">$${apt.price.toLocaleString('es-CO')}</span>
                            <button onclick="deleteAppointment('${apt.id}')" class="text-rose-400 hover:text-rose-300">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        timelineContainer.appendChild(col);
    });

    // Render Table View
    tableBody.innerHTML = '';
    filtered.forEach(apt => {
        const barberObj = state.barbers.find(b => b.id === apt.barber);
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-700/30 transition-colors';
        tr.innerHTML = `
            <td class="p-3 font-medium text-slate-200">
                <div class="font-bold text-xs">${apt.id}</div>
                <div class="text-[10px] text-slate-400">${apt.time}</div>
            </td>
            <td class="p-3 font-semibold text-slate-100">${apt.client}</td>
            <td class="p-3 text-slate-300">${apt.service}</td>
            <td class="p-3 text-slate-300">${barberObj ? barberObj.name : apt.barber}</td>
            <td class="p-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-medium ${apt.status === 'Completada' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
                    ${apt.status}
                </span>
            </td>
            <td class="p-3 text-right">
                <button onclick="deleteAppointment('${apt.id}')" class="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded transition-colors text-[10px]">
                    Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Update Metrics KPIs
    const totalApts = state.appointments.length;
    const totalRevenue = state.appointments.reduce((acc, curr) => acc + curr.price, 0);
    const occupancyRate = Math.min(Math.round((totalApts / 12) * 100), 100);

    document.getElementById('kpi-total-citas').innerText = totalApts;
    document.getElementById('kpi-ingresos').innerText = `$${totalRevenue.toLocaleString('es-CO')}`;
    document.getElementById('kpi-ocupacion').innerText = `${occupancyRate}%`;
}

// Delete Appointment Global Handler
window.deleteAppointment = function(id) {
    state.appointments = state.appointments.filter(a => a.id !== id);
    renderDashboard();
};
