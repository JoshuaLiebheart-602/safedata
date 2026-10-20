/* SafeData IA — prototipo educativo, JavaScript nativo.
   Procesa solo texto ficticio en el navegador; NO garantiza anonimización. */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Pantalla independiente de resultados: ejemplo ficticio editable.
  const demoResult = document.getElementById('demo-result');
  if (demoResult) {
    const initialExample = demoResult.value;
    const demoStatus = document.getElementById('demo-status');
    document.getElementById('demo-reset').addEventListener('click', () => {
      demoResult.value = initialExample;
      demoStatus.textContent = 'Ejemplo restaurado.';
      demoResult.focus();
    });
    document.getElementById('demo-download').addEventListener('click', () => {
      const blob = new Blob([demoResult.value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'safedata-ejemplo-revisado.txt';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      demoStatus.textContent = 'Se preparó la descarga del ejemplo.';
    });
  }

  const form = document.getElementById('anonymize-form');
  if (!form) return; // Otras páginas no contienen este formulario.

  const title = document.getElementById('document-title');
  const source = document.getElementById('document-text');
  const profile = document.getElementById('professional-profile');
  const titleError = document.getElementById('title-error');
  const textError = document.getElementById('text-error');
  const status = document.getElementById('form-status');

  // Reglas de ejemplo: detectan patrones, no verifican identidades.
  const rules = [
    { name: 'detectEmail', label: 'CORREO', regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
    { name: 'detectDni', label: 'DNI', regex: /\b(?:DNI\s*[:#-]?\s*)?\d{1,2}[.]?\d{3}[.]?\d{3}\b/gi },
    { name: 'detectPhone', label: 'TELÉFONO', regex: /\b(?:Tel(?:éfono)?\s*[:#-]?\s*)?(?:\+?54[\s-]?)?(?:0?\d{2,4}[\s-]?)?\d{3,4}[\s-]?\d{4}\b/gi },
    { name: 'detectNames', label: 'NOMBRE', regex: /\b(?:Paciente|Nombre|Sr\.?|Sra\.?)\s*:\s*[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,2}\b/g },
    { name: 'detectAge', label: 'EDAD', regex: /\b(?:Edad\s*:\s*\d{1,3}|\d{1,3}\s*años)\b/gi }
  ];

  // Evitar solapamientos: priorizar etiquetas explícitas y patrones más específicos.
  const priority = ['detectNames', 'detectEmail', 'detectDni', 'detectAge', 'detectPhone'];
  const orderedRules = priority.map(name => rules.find(rule => rule.name === name));

  const result = document.createElement('section');
  result.id = 'preview-result';
  result.className = 'tool-card';
  result.hidden = true;
  result.setAttribute('aria-labelledby', 'result-title');
  result.innerHTML = `
    <div class="tool-card-heading"><span class="card-number">03 / REVISIÓN</span><h2 id="result-title">Revisar el resultado</h2></div>
    <p class="field-hint">Los reemplazos son aproximados. Revisá y editá manualmente antes de descargar.</p>
    <div class="form-field"><label for="result-original">Texto original</label>
      <textarea id="result-original" rows="7" readonly></textarea></div>
    <div class="form-field"><label for="result-edited">Texto procesado (editable)</label>
      <textarea id="result-edited" rows="7" aria-describedby="result-warning"></textarea></div>
    <p id="result-warning" class="field-hint">No ingreses información real o confidencial en este prototipo.</p>
    <p id="result-count" class="form-status" role="status"></p>
    <div class="form-actions">
      <button type="button" class="button button-secondary" id="undo-result">Deshacer cambios manuales</button>
      <button type="button" class="button button-primary" id="download-result">Descargar TXT revisado</button>
    </div>`;
  form.insertAdjacentElement('afterend', result);

  const originalOutput = result.querySelector('#result-original');
  const editedOutput = result.querySelector('#result-edited');
  const countOutput = result.querySelector('#result-count');
  let generatedText = '';

  function clearErrors() {
    titleError.textContent = '';
    textError.textContent = '';
    title.removeAttribute('aria-invalid');
    source.removeAttribute('aria-invalid');
    status.textContent = '';
  }

  function anonymize(text) {
    const selected = orderedRules.filter(rule => form.elements[rule.name].checked);
    const matches = [];
    for (const rule of selected) {
      rule.regex.lastIndex = 0;
      for (const match of text.matchAll(rule.regex)) {
        matches.push({ start: match.index, end: match.index + match[0].length, label: rule.label });
      }
    }
    matches.sort((a, b) => a.start - b.start || b.end - a.end);
    const accepted = [];
    let lastEnd = 0;
    for (const match of matches) {
      if (match.start >= lastEnd) {
        accepted.push(match);
        lastEnd = match.end;
      }
    }
    let output = '';
    let cursor = 0;
    for (const match of accepted) {
      output += text.slice(cursor, match.start) + `[${match.label}]`;
      cursor = match.end;
    }
    return { text: output + text.slice(cursor), count: accepted.length };
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();
    let valid = true;
    if (title.value.trim().length < 3) {
      titleError.textContent = 'Ingresá un título de al menos 3 caracteres.';
      title.setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (source.value.trim().length < 20) {
      textError.textContent = 'Ingresá un texto de al menos 20 caracteres.';
      source.setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (!valid) {
      status.textContent = 'Revisá los campos marcados.';
      (title.getAttribute('aria-invalid') ? title : source).focus();
      result.hidden = true;
      return;
    }

    const processed = anonymize(source.value);
    generatedText = processed.text;
    originalOutput.value = source.value;
    editedOutput.value = generatedText;
    countOutput.textContent = `${processed.count} coincidencia(s) detectada(s). Perfil seleccionado: ${profile.selectedOptions[0].textContent}. Verificá el resultado manualmente.`;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    editedOutput.focus({ preventScroll: true });
  });

  result.querySelector('#undo-result').addEventListener('click', () => {
    editedOutput.value = generatedText;
    countOutput.textContent = 'Se restauró el resultado automático. Podés volver a editarlo.';
    editedOutput.focus();
  });

  result.querySelector('#download-result').addEventListener('click', () => {
    if (result.hidden) return;
    const file = new Blob([editedOutput.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    const safeTitle = title.value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]+/gi, '-').slice(0, 50) || 'documento';
    link.href = url;
    link.download = `${safeTitle}-revisado.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  form.addEventListener('reset', () => {
    clearErrors();
    result.hidden = true;
    generatedText = '';
  });
});
