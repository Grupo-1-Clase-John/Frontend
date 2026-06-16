// ============================================================
// formGuard.js — SCRIPT DE SEGURIDAD (no-module)
// Agregado para evitar que los formularios recarguen la página
// cuando los módulos ES no cargan (ej. file:// CORS).
// Se ejecuta SIEMPRE, incluso si script.js (module) falla.
// ============================================================
// NOTA: Se carga en el HTML justo antes del cierre de </body>,
//       es un script clásico (sin type="module"), por lo que
//       funciona incluso si los módulos ES están bloqueados.
// ============================================================

(function() {
    'use strict';

    var modulesLoaded = false;
    var guardAllTasks = [];

    // Los módulos ES disparan 'modulesReady' al cargar
    document.addEventListener('modulesReady', function() {
        modulesLoaded = true;
    });

    // ================================
    // 1) Formulario de búsqueda
    // ================================
    var searchForm = document.getElementById('userSearchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (modulesLoaded) return;

            fallbackSearch();
        });
    }

    // ================================
    // 2) Formulario de tareas
    // ================================
    var taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (modulesLoaded) return;

            fallbackSaveTask();
        });
    }

    // ================================
    // 3) Filtros de la tabla (fallback)
    // ================================
    var filterStatus = document.getElementById('filterStatus');
    var filterUser = document.getElementById('filterUser');
    var filterDateOrder = document.getElementById('filterDateOrder');

    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            if (modulesLoaded) return;
            renderFallbackFiltered();
        });
    }
    if (filterUser) {
        filterUser.addEventListener('change', function() {
            if (modulesLoaded) return;
            renderFallbackFiltered();
        });
    }
    if (filterDateOrder) {
        filterDateOrder.addEventListener('change', function() {
            if (modulesLoaded) {
                applyDateSortDOM();
                return;
            }
            renderFallbackFiltered();
        });
    }

    // ------------------------------------------------------------------
    // BÚSQUEDA FALLBACK
    // ------------------------------------------------------------------
    function fallbackSearch() {
        var input = document.getElementById('userDocument');
        var docValue = (input && input.value || '').trim();
        if (!docValue) return;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://192.168.137.1:3007/users', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    var users = Array.isArray(data) ? data : (data.users || []);
                    var found = users.find(function(u) {
                        return String(u.id).trim() === docValue;
                    });

                    if (found) {
                        renderUserFound(found);
                    } else {
                        renderUserError('Usuario no encontrado en el sistema');
                    }
                } catch(e) {
                    renderUserError('Error al procesar la respuesta del servidor');
                }
            } else {
                renderUserError('No se pudo conectar con el servidor (HTTP ' + xhr.status + ')');
            }
        };
        xhr.onerror = function() {
            renderUserError('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
        };
        xhr.send();
    }

    // ------------------------------------------------------------------
    // GUARDADO FALLBACK DE TAREA
    // ------------------------------------------------------------------
    function fallbackSaveTask() {
        var title = document.getElementById('taskTitle');
        var desc = document.getElementById('taskDescription');
        var status = document.getElementById('taskStatus');
        var msg = document.getElementById('userSearchMessage');

        if (!title || !desc || !status) return;
        if (!title.value.trim() || !desc.value.trim() || !status.value) {
            if (msg) {
                msg.textContent = 'Todos los campos son obligatorios.';
                msg.classList.remove('hidden');
                msg.classList.add('info-message--error');
            }
            return;
        }

        // Obtener currentUserId desde sessionStorage (lo guarda el módulo o el fallbackSearch)
        var userId = sessionStorage.getItem('guardCurrentUserId') || '';

        var taskData = {
            id: String(Date.now()),
            userId: userId,
            title: title.value.trim(),
            description: desc.value.trim(),
            status: status.value,
            createdAt: new Date().toISOString()
        };

        var editingId = sessionStorage.getItem('guardEditingTaskId');
        var submitBtn = document.getElementById('submitTaskBtn');

        var xhr = new XMLHttpRequest();
        if (editingId) {
            xhr.open('PATCH', 'http://192.168.137.1:3007/tasks/' + editingId, true);
        } else {
            xhr.open('POST', 'http://192.168.137.1:3007/tasks', true);
        }
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 201 || xhr.status === 200) {
                if (msg) {
                    msg.textContent = editingId ? 'Tarea actualizada correctamente.' : 'Tarea guardada correctamente.';
                    msg.classList.remove('hidden', 'info-message--error');
                }
                showGuardToast(editingId ? 'Tarea actualizada correctamente.' : 'Tarea guardada correctamente.', 'success');
                taskForm.reset();
                if (status) status.value = '';
                if (submitBtn) submitBtn.textContent = 'Registrar tarea';
                sessionStorage.removeItem('guardEditingTaskId');
                // Refrescar la tabla de tareas
                refreshTasksFallback();
            } else {
                if (msg) {
                    msg.textContent = 'Error al guardar la tarea (HTTP ' + xhr.status + ')';
                    msg.classList.remove('hidden');
                    msg.classList.add('info-message--error');
                }
                showGuardToast('Error al guardar la tarea.', 'error');
            }
        };
        xhr.onerror = function() {
            if (msg) {
                msg.textContent = 'No se pudo conectar con el servidor.';
                msg.classList.remove('hidden');
                msg.classList.add('info-message--error');
            }
            showGuardToast('No se pudo conectar con el servidor.', 'error');
        };

        if (editingId) {
            // En edición solo enviamos los campos editables
            var patchData = {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status
            };
            xhr.send(JSON.stringify(patchData));
        } else {
            xhr.send(JSON.stringify(taskData));
        }
    }

    // ------------------------------------------------------------------
    // ELIMINAR TAREA (fallback)
    // ------------------------------------------------------------------
    function fallbackDeleteTask(taskId) {
        var msg = document.getElementById('userSearchMessage');
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'http://192.168.137.1:3007/tasks/' + taskId, true);
        xhr.onload = function() {
            if (xhr.status === 200 || xhr.status === 204) {
                if (msg) {
                    msg.textContent = 'Tarea eliminada correctamente.';
                    msg.classList.remove('hidden', 'info-message--error');
                }
                showGuardToast('Tarea eliminada correctamente.', 'success');
                refreshTasksFallback();
            } else {
                if (msg) {
                    msg.textContent = 'Error al eliminar la tarea (HTTP ' + xhr.status + ')';
                    msg.classList.remove('hidden');
                    msg.classList.add('info-message--error');
                }
                showGuardToast('Error al eliminar la tarea.', 'error');
            }
        };
        xhr.onerror = function() {
            if (msg) {
                msg.textContent = 'No se pudo conectar con el servidor.';
                msg.classList.remove('hidden');
                msg.classList.add('info-message--error');
            }
            showGuardToast('No se pudo conectar con el servidor.', 'error');
        };
        xhr.send();
    }

    // ------------------------------------------------------------------
    // EDITAR TAREA (fallback) — llena el formulario con los datos
    // ------------------------------------------------------------------
    function fallbackEditTask(task) {
        var titleInput = document.getElementById('taskTitle');
        var descInput = document.getElementById('taskDescription');
        var statusSelect = document.getElementById('taskStatus');
        var submitBtn = document.getElementById('submitTaskBtn');
        var fieldset = document.getElementById('taskFormFieldset');

        if (titleInput) titleInput.value = task.title || '';
        if (descInput) descInput.value = task.description || '';
        if (statusSelect) statusSelect.value = task.status || '';
        if (submitBtn) submitBtn.textContent = 'Actualizar tarea';
        if (fieldset) fieldset.disabled = false;

        sessionStorage.setItem('guardEditingTaskId', String(task.id));
    }

    // ------------------------------------------------------------------
    // REFRESCAR TABLA DE TAREAS (fallback)
    // ------------------------------------------------------------------
    function refreshTasksFallback() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://192.168.137.1:3007/tasks', true);
        xhr.onload = function() {
            if (xhr.status !== 200) return;
            try {
                var data = JSON.parse(xhr.responseText);
                guardAllTasks = Array.isArray(data) ? data : (data.tasks || []);
                renderFallbackFiltered();
            } catch(e) {
                // Error silencioso al refrescar tabla
            }
        };
        xhr.send();
    }

    // ------------------------------------------------------------------
    // RENDERIZAR TABLA FILTRADA (fallback)
    // ------------------------------------------------------------------
    function renderFallbackFiltered() {
        var filterUserId = sessionStorage.getItem('guardCurrentUserId') || '';
        var statusVal = filterStatus ? filterStatus.value : '';
        var orderVal = filterDateOrder ? filterDateOrder.value : '';
        var tbody = document.getElementById('tasksTableBody');
        var emptyState = document.getElementById('tasksEmptyState');
        if (!tbody) return;

        // Limpiar tabla
        tbody.innerHTML = '';

        // Filtrar por usuario actual (guardCurrentUserId)
        var filtered = guardAllTasks;
        if (filterUserId) {
            filtered = filtered.filter(function(t) {
                return String(t.userId).trim() === filterUserId;
            });
        }

        // Priorizar por estado (seleccionado arriba, resto debajo)
        if (statusVal) {
            var priority = [];
            var rest = [];
            filtered.forEach(function(t) {
                if (t.status === statusVal) { priority.push(t); }
                else { rest.push(t); }
            });
            filtered = priority.concat(rest);
        }

        // Ordenar por fecha
        if (orderVal === 'asc') {
            filtered.sort(function(a, b) {
                var da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                var db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return da - db;
            });
        } else if (orderVal === 'desc') {
            filtered.sort(function(a, b) {
                var da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                var db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return db - da;
            });
        }

        if (filtered.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        if (emptyState) emptyState.classList.add('hidden');

        // Renderizar cada tarea
        filtered.forEach(function(task) {
            var row = document.createElement('tr');
            row.className = 'tasks__row';
            row.dataset.taskId = task.id;

            // Titulo
            var td1 = document.createElement('td');
            td1.className = 'tasks__cell';
            td1.textContent = task.title || '';
            row.appendChild(td1);

            // Descripcion
            var td2 = document.createElement('td');
            td2.className = 'tasks__cell';
            td2.textContent = task.description || '';
            row.appendChild(td2);

            // Estado (badge)
            var td3 = document.createElement('td');
            td3.className = 'tasks__cell';
            var badge = document.createElement('span');
            var statusMap = {
                'pendiente': 'Pendiente',
                'en-proceso': 'En Proceso',
                'completada': 'Completada'
            };
            var classMap = {
                'pendiente': 'pending',
                'en-proceso': 'in-progress',
                'completada': 'completed'
            };
            badge.className = 'task-status task-status--' + (classMap[task.status] || 'pending');
            badge.textContent = statusMap[task.status] || task.status;
            td3.appendChild(badge);
            row.appendChild(td3);

            // Usuario
            var td4 = document.createElement('td');
            td4.textContent = 'Usuario ' + (task.userId || '');
            row.appendChild(td4);

            // Fecha/Hora
            var td5 = document.createElement('td');
            td5.className = 'tasks__cell';
            if (task.createdAt) {
                var d = new Date(task.createdAt);
                td5.textContent = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
            } else {
                td5.textContent = '-';
            }
            row.appendChild(td5);

            // Acciones
            var td6 = document.createElement('td');
            td6.className = 'tasks__cell';
            // Boton Eliminar
            var delBtn = document.createElement('button');
            delBtn.className = 'btn btn--primary btn--small';
            delBtn.textContent = 'Eliminar';
            (function(taskId) {
                delBtn.addEventListener('click', function() {
                    fallbackDeleteTask(taskId);
                });
            })(task.id);
            td6.appendChild(delBtn);
            // Boton Editar
            var editBtn = document.createElement('button');
            editBtn.className = 'btn btn--primary btn--small';
            editBtn.textContent = 'Editar';
            editBtn.type = 'button';
            (function(task) {
                editBtn.addEventListener('click', function() {
                    fallbackEditTask(task);
                });
            })(task);
            td6.appendChild(editBtn);
            row.appendChild(td6);

            tbody.appendChild(row);
        });
    }

    // ------------------------------------------------------------------
    // ORDENAR FILAS EN EL DOM POR FECHA (modo modulos cargados)
    // ------------------------------------------------------------------
    function applyDateSortDOM() {
        var orderVal = filterDateOrder ? filterDateOrder.value : '';
        var tbody = document.getElementById('tasksTableBody');
        if (!tbody) return;

        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        if (rows.length === 0) return;

        if (!orderVal) return;

        rows.sort(function(a, b) {
            var da = a.cells[4] ? a.cells[4].dataset.createdAt || '' : '';
            var db = b.cells[4] ? b.cells[4].dataset.createdAt || '' : '';
            var ta = da ? new Date(da).getTime() : 0;
            var tb = db ? new Date(db).getTime() : 0;
            return orderVal === 'asc' ? ta - tb : tb - ta;
        });

        rows.forEach(function(row) {
            tbody.appendChild(row);
        });
    }

    // ------------------------------------------------------------------
    // TOAST FALLBACK — muestra notificación con clases ntf-*
    // ------------------------------------------------------------------
    function showGuardToast(message, type) {
        type = type || 'info';
        var container = document.querySelector('.ntf-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'ntf-container';
            document.body.appendChild(container);
        }
        var toast = document.createElement('div');
        toast.className = 'ntf-toast ntf-' + type;
        var text = document.createElement('span');
        text.textContent = message;
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'background:none;border:none;color:#94a3b8;font-size:1.25rem;cursor:pointer;padding:0 0 0 0.5rem;line-height:1;flex-shrink:0;';
        closeBtn.addEventListener('click', function() {
            toast.classList.remove('ntf-visible');
            toast.classList.add('ntf-exit');
            setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
        });
        toast.appendChild(text);
        toast.appendChild(closeBtn);
        container.appendChild(toast);
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                toast.classList.add('ntf-visible');
            });
        });
        setTimeout(function() {
            toast.classList.remove('ntf-visible');
            toast.classList.add('ntf-exit');
            setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
        }, 4500);
    }

    // ------------------------------------------------------------------
    // UI helpers
    // ------------------------------------------------------------------
    function renderUserFound(user) {
        var card = document.getElementById('userCard');
        var msg = document.getElementById('userSearchMessage');
        var nameEl = document.getElementById('userNameDisplay');
        var docEl = document.getElementById('userDocumentDisplay');
        var emailEl = document.getElementById('userEmailDisplay');
        var fieldset = document.getElementById('taskFormFieldset');

        if (nameEl) nameEl.textContent = user.name || '';
        if (docEl) docEl.textContent = user.id || '';
        if (emailEl) emailEl.textContent = user.email || '';
        if (card) card.classList.remove('hidden');
        if (msg) msg.classList.add('hidden');
        if (fieldset) fieldset.disabled = false;

        // Guarda userId para el fallback de tareas
        sessionStorage.setItem('guardCurrentUserId', String(user.id || ''));
        // Refrescar tabla con las tareas de este usuario
        refreshTasksFallback();
        showGuardToast('Usuario ' + user.name + ' encontrado.', 'success');
    }

    function renderUserError(message) {
        var card = document.getElementById('userCard');
        var msg = document.getElementById('userSearchMessage');
        var fieldset = document.getElementById('taskFormFieldset');

        if (card) card.classList.add('hidden');
        if (fieldset) fieldset.disabled = true;
        if (msg) {
            msg.textContent = message;
            msg.classList.remove('hidden');
            msg.classList.add('info-message--error');
        }
        showGuardToast(message, 'error');
    }
})();
