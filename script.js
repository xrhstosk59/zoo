// Import all operations
import { createZwoForm, handleZwoDelete } from './ZWO/zwo.js';
import { createTamiasForm, handleTamiasDelete } from './TAMIAS/tamias.js';
import { createFrontistisForm, handleFrontistisDelete } from './FRONTISTIS/frontistis.js';
import { createepiskeptisForm, handleepiskeptisDelete } from './EPISKEPTIS/episkeptis.js';
import { createEisitirioForm, handleEisitirioDelete } from './EISITIRIO/eisitirio.js';
import { createEkdilosiForm, handleEkdilosiDelete } from './EKDILOSI/ekdilosi.js';
import { createeidosForm, handleeidosDelete } from './EIDOS/eidos.js';
import { createpromitheutisForm, handlepromitheutisDelete } from './PROMITHEUTIS/promitheutis.js';

// script.js
export async function loadData(section, page = 1) {
    try {
        const encodedSection = encodeURIComponent(section);
        // Χρήση relative path για καλύτερη φορητότητα
        const response = await fetch(`./db.php?section=${encodedSection}&page=${page}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message, true);
        return null;
    }
}
export function showForm(formType, section, data = null) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = '';

    let form;
    switch (section) {
        case 'Ζώα':
            form = createZwoForm(formType, data);
            break;
        case 'Ταμίες':
            form = createTamiasForm(formType, data);
            break;
        case 'Φροντιστές':
            form = createFrontistisForm(formType, data);
            break;
        case 'Επισκέπτες':
            form = createepiskeptisForm(formType, data);
            break;
        case 'Εισιτήρια':
            form = createEisitirioForm(formType, data);
            break;
        case 'Εκδηλώσεις':
            form = createEkdilosiForm(formType, data);
            break;
        case 'Είδη':
            form = createeidosForm(formType, data);
            break;
        case 'Προμηθευτές':
            form = createpromitheutisForm(formType, data);
            break;
        default:
            throw new Error('Άγνωστη ενότητα');
    }

    contentElement.appendChild(form);
}

export async function handleDelete(section, data) {
    switch (section) {
        case 'Ζώα':
            return handleZwoDelete(data);
        case 'Ταμίες':
            return handleTamiasDelete(data);
        case 'Φροντιστές':
            return handleFrontistisDelete(data);
        case 'Επισκέπτες':
            return handleepiskeptisDelete(data);
        case 'Εισιτήρια':
            return handleEisitirioDelete(data);
        case 'Εκδηλώσεις':
            return handleEkdilosiDelete(data);
        case 'Είδη':
            return handleeidosDelete(data);
        case 'Προμηθευτές':
            return handlepromitheutisDelete(data);
        default:
            throw new Error('Άγνωστη ενότητα');
    }
}

export async function loadSection(section, page = 1) {
    showLoading();
    try {
        const data = await loadData(section, page);
        displayData(section, data);
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

export function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

export function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

export function showMessage(message, isError = false) {
    const sanitizedMessage = typeof message === 'string' ?
        message.replace(/<[^>]*>/g, '') :
        'Προέκυψε ένα σφάλμα';

    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.textContent = sanitizedMessage;

    const content = document.getElementById('content');
    content.insertBefore(messageDiv, content.firstChild);

    setTimeout(() => messageDiv.remove(), 5000);
}

function displayData(section, data) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = '';

    // Add Button
    const addButton = document.createElement('button');
    addButton.textContent = `Προσθήκη ${section}`;
    addButton.className = 'add-button';
    addButton.onclick = () => showForm('Προσθήκη', section);
    contentElement.appendChild(addButton);

    if (data.data && data.data.length > 0) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Headers
        const headerRow = document.createElement('tr');
        Object.keys(data.data[0]).forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        });
        const actionsHeader = document.createElement('th');
        actionsHeader.textContent = 'Ενέργειες';
        headerRow.appendChild(actionsHeader);
        thead.appendChild(headerRow);

        // Data rows
        data.data.forEach(row => {
            const tr = document.createElement('tr');
            // Διόρθωση για σωστή διαχείριση null τιμών
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value === null ? '-' : value;
                tr.appendChild(td);
            });
            const actionsTd = document.createElement('td');
            actionsTd.className = 'action-buttons';

            const editButton = document.createElement('button');
            editButton.textContent = 'Επεξεργασία';
            editButton.className = 'edit-button';
            editButton.onclick = () => showForm('Επεξεργασία', section, row);
            actionsTd.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Διαγραφή';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = () => handleDelete(section, row);
            actionsTd.appendChild(deleteButton);

            tr.appendChild(actionsTd);
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        contentElement.appendChild(table);

        // Pagination
        if (data.pagination) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination';

            const totalPages = data.pagination.totalPages;
            const currentPage = data.pagination.currentPage;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages ||
                    (i >= currentPage - 2 && i <= currentPage + 2)) {
                    const pageLink = document.createElement('a');
                    pageLink.href = '#';
                    pageLink.textContent = i;
                    if (i === currentPage) pageLink.className = 'active';
                    pageLink.onclick = (e) => {
                        e.preventDefault();
                        loadSection(section, i);
                    };
                    paginationDiv.appendChild(pageLink);
                } else if (i === 2 || i === totalPages - 1) {
                    const dots = document.createElement('span');
                    dots.textContent = '...';
                    dots.className = 'pagination-dots';
                    paginationDiv.appendChild(dots);
                }
            }
            contentElement.appendChild(paginationDiv);

            const paginationInfo = document.createElement('div');
            paginationInfo.className = 'pagination-info';
            paginationInfo.textContent = `Σελίδα ${currentPage} από ${totalPages}`;
            contentElement.appendChild(paginationInfo);
        }
    } else {
        const noData = document.createElement('p');
        noData.textContent = 'Δεν βρέθηκαν δεδομένα';
        contentElement.appendChild(noData);
    }
}

// Event listener for navigation
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.textContent;
            loadSection(section);

            // Update active link
            links.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Load default section
    loadSection('Ζώα');
});