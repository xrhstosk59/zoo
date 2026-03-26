import { loadSection, showMessage, showLoading, hideLoading } from '../script.js';
import { setupFormValidation } from '../ValidationFunctions.js';

const eisitirioFields = [
    { name: 'kodikos', label: 'Κωδικός', required: true, type: 'number', min: 1 },
    { name: 'hmerominia_ekdoshs', label: 'Ημερομηνία Έκδοσης', required: true, type: 'date' },
    { name: 'timi', label: 'Τιμή', required: true, type: 'number', min: 0, step: '0.01' },
    { name: 'idTamia', label: 'ID Ταμία', required: true, type: 'number', min: 1 },
    { name: 'email', label: 'Email Επισκέπτη', required: true, type: 'email' },
    { name: 'katigoria', label: 'Κατηγορία', required: true, type: 'select', options: ['Με εκδήλωση', 'Χωρίς εκδήλωση'] }
];

function createEisitirioForm(formType, data = null) {
    const form = document.createElement('form');
    form.className = 'entity-form';
    // Αντί για onsubmit, χρησιμοποίησε addEventListener με async handler
    form.addEventListener('submit', async (e) => {
        await handleEisitirioSubmit(e, formType);
    });

    const title = document.createElement('h2');
    title.textContent = `${formType} Εισιτηρίου`;
    form.appendChild(title);

    if (formType === 'Επεξεργασία' && data) {
        const originalCode = document.createElement('input');
        originalCode.type = 'hidden';
        originalCode.name = 'original_kodikos';
        originalCode.value = data.Kodikos;
        form.appendChild(originalCode);

        const originalDate = document.createElement('input');
        originalDate.type = 'hidden';
        originalDate.name = 'original_hmerominia';
        originalDate.value = data.Hmerominia_Ekdoshs;
        form.appendChild(originalDate);
    }

    eisitirioFields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = field.name;
        label.textContent = field.label;
        if (field.required) label.classList.add('required');
        formGroup.appendChild(label);

        if (field.type === 'select') {
            const select = document.createElement('select');
            select.name = field.name;
            select.id = field.name;
            select.required = field.required;

            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                if (data && data.Katigoria === option) {
                    opt.selected = true;
                }
                select.appendChild(opt);
            });

            formGroup.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.id = field.name;
            input.required = field.required;
            if (field.min !== undefined) input.min = field.min;
            if (field.step !== undefined) input.step = field.step;

            if (data) {
                switch(field.name) {
                    case 'kodikos':
                        input.value = data.Kodikos;
                        if (formType === 'Επεξεργασία') input.readOnly = true;
                        break;
                    case 'hmerominia_ekdoshs':
                        input.value = data.Hmerominia_Ekdoshs;
                        if (formType === 'Επεξεργασία') input.readOnly = true;
                        break;
                    case 'timi':
                        input.value = data.Timi;
                        break;
                    case 'idTamia':
                        input.value = data.IDTamia || '';
                        break;
                    case 'email':
                        input.value = data.Email;
                        break;
                }
            }

            formGroup.appendChild(input);
        }

        form.appendChild(formGroup);
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'form-buttons';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = formType;
    buttonsDiv.appendChild(submitButton);

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Ακύρωση';
    cancelButton.className = 'cancel-button';
    cancelButton.onclick = () => loadSection('Εισιτήρια');
    buttonsDiv.appendChild(cancelButton);

    form.appendChild(buttonsDiv);
    setupFormValidation(form); 
    return form;
}

async function handleEisitirioSubmit(event, formType) {
    event.preventDefault();
    showLoading();

    try {
        if (formType !== 'Προσθήκη' && formType !== 'Επεξεργασία') {
            throw new Error('Μη έγκυρος τύπος φόρμας');
        }

        const formData = new FormData(event.target);
        const url = `./EISITIRIO/${formType === 'Προσθήκη' ? 'add' : 'update'}_eisitirio.php`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Σφάλμα απόκρισης: ${errorText}`);
        }

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        loadSection('Εισιτήρια');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

async function handleEisitirioDelete(data) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το εισιτήριο;')) {
        return;
    }

    try {
        showLoading();
        const response = await fetch('./EISITIRIO/delete_eisitirio.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Σφάλμα απόκρισης: ${errorText}`);
        }

        const result = await response.json();
        if (result.status === 'error') throw new Error(result.message);

        showMessage(result.message, false);
        await loadSection('Εισιτήρια');
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        hideLoading();
    }
}

export {
    createEisitirioForm,
    handleEisitirioSubmit,
    handleEisitirioDelete,
    eisitirioFields
};
