/*
 * Formulario de contacto.
 * Sin `formEndpoint` la solicitud se entrega por WhatsApp: el mensaje queda listo
 * y el cliente lo envía desde la app, por lo que nunca se afirma que ya fue recibida.
 * Con `formEndpoint` se hace POST y solo se confirma ante una respuesta exitosa.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Celular (3XX XXX XXXX) o fijo (60X XXX XXXX) de Colombia, con o sin +57. */
function isValidPhone(value) {
  const digits = value.replace(/\D/g, '').replace(/^57(?=\d{10}$)/, '');
  return /^(3\d{9}|60\d{8})$/.test(digits);
}

const validators = {
  nombre: (v) => (v.trim().length >= 3 ? '' : 'Escribe tu nombre completo.'),
  telefono: (v) => {
    if (!v.trim()) return 'Escribe tu número de teléfono.';
    return isValidPhone(v) ? '' : 'Escribe un número válido de 10 dígitos, por ejemplo 300 123 4567.';
  },
  correo: (v) => {
    if (!v.trim()) return 'Escribe tu correo electrónico.';
    return EMAIL.test(v.trim()) ? '' : 'Revisa el formato del correo, por ejemplo nombre@correo.com.';
  },
  servicio: (v) => (v ? '' : 'Selecciona el tipo de servicio.'),
  electrodomestico: (v) => (v ? '' : 'Selecciona el tipo de electrodoméstico.'),
  descripcion: (v) => (v.trim().length >= 10 ? '' : 'Cuéntanos un poco más sobre el problema.'),
  direccion: (v) => (v.trim().length >= 3 ? '' : 'Escribe tu dirección o municipio.'),
  horario: (v) => (v ? '' : 'Selecciona un horario de contacto.'),
};

function buildMessage(data) {
  const lines = [
    'Hola, quisiera solicitar un servicio técnico.',
    '',
    `Nombre: ${data.nombre}`,
    `Teléfono: ${data.telefono}`,
    `Correo: ${data.correo}`,
    `Servicio: ${data.servicio}`,
    `Electrodoméstico: ${data.electrodomestico}`,
  ];
  if (data.marca) lines.push(`Marca: ${data.marca}`);
  lines.push(`Problema: ${data.descripcion}`, `Dirección o municipio: ${data.direccion}`, `Horario de contacto: ${data.horario}`);
  return lines.join('\n');
}

function initForm(form) {
  const status = form.querySelector('[data-status]');
  const submit = form.querySelector('[data-submit]');
  const { endpoint, whatsapp, email } = form.dataset;

  const setError = (field, message) => {
    const error = form.querySelector(`#${field.id}-e`);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
  };

  const validateField = (field) => {
    const message = field.type === 'checkbox'
      ? (field.checked ? '' : 'Debes aceptar la política de privacidad para continuar.')
      : validators[field.name]?.(field.value) ?? '';
    setError(field, message);
    return !message;
  };

  const fields = [...form.querySelectorAll('input[required], select[required], textarea[required]')];

  fields.forEach((field) => {
    const check = () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    };
    field.addEventListener('input', check);
    field.addEventListener('change', check);
    field.addEventListener('blur', () => {
      if (field.value && field.type !== 'checkbox') validateField(field);
    });
  });

  const showStatus = (type, html) => {
    status.hidden = false;
    status.className = `form__status form__status--${type}`;
    status.innerHTML = html;
    status.focus({ preventScroll: true });
    status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const setLoading = (loading) => {
    submit.disabled = loading;
    submit.classList.toggle('is-loading', loading);
  };

  const mailto = (message) =>
    `mailto:${email}?subject=${encodeURIComponent('Solicitud de servicio técnico')}&body=${encodeURIComponent(message)}`;

  const sendByWhatsApp = (message) => {
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    showStatus(
      'info',
      `<strong>${opened ? 'Abrimos WhatsApp con tu solicitud' : 'Tu solicitud está lista'}</strong>
       <p>Para completarla, presiona enviar en WhatsApp. Si no se abrió, usa una de estas opciones:</p>
       <p class="form__status-links"><a href="${url}" target="_blank" rel="noopener">Abrir WhatsApp</a><a href="${mailto(message)}">Enviar por correo</a></p>`,
    );
  };

  const sendToEndpoint = async (data, message) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      showStatus('success', '<strong>Recibimos tu solicitud</strong><p>Te contactaremos para coordinar el servicio.</p>');
    } catch {
      const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
      showStatus(
        'error',
        `<strong>No pudimos enviar tu solicitud</strong>
         <p>Tus datos siguen en el formulario. Inténtalo de nuevo o usa otro canal:</p>
         <p class="form__status-links"><a href="${url}" target="_blank" rel="noopener">Enviar por WhatsApp</a><a href="${mailto(message)}">Enviar por correo</a></p>`,
      );
    } finally {
      setLoading(false);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.hidden = true;

    const invalid = fields.filter((field) => !validateField(field));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    if (data.sitio_web) return;
    delete data.sitio_web;
    delete data.privacidad;

    const message = buildMessage(data);
    if (endpoint) sendToEndpoint(data, message);
    else sendByWhatsApp(message);
  });
}

document.querySelectorAll('[data-contact-form]').forEach(initForm);
