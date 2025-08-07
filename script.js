document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('taskTitleInput');
    const taskDescInput = document.getElementById('taskDescInput');
    const taskPriority = document.getElementById('taskPriority');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    
    // Load tasks from localStorage
    loadTasks();
    
    addTaskBtn.addEventListener('click', addTask);
    
    // Allow adding task with Enter key
    taskTitleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    function addTask() {
        const taskTitle = taskTitleInput.value.trim();
        const taskDesc = taskDescInput.value.trim();
        const priority = taskPriority.value;
        
        if (taskTitle === '') {
            taskTitleInput.focus();
            return;
        }
        
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        
        // Add slide-in animation
        taskItem.style.animation = 'slideUp 0.4s ease-out';
        
        taskItem.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">${taskTitle}</h3>
                ${taskDesc ? `<p class="task-desc">${taskDesc}</p>` : ''}
                <span class="task-priority priority-${priority}">${priority}</span>
            </div>
            <div class="task-actions">
                <button class="task-btn complete-btn" title="Complete">✓</button>
                <button class="task-btn delete-btn" title="Delete">✕</button>
            </div>
        `;
        
        // Add to the top of the list
        if (taskList.firstChild) {
            taskList.insertBefore(taskItem, taskList.firstChild);
        } else {
            taskList.appendChild(taskItem);
        }
        
        // Clear inputs
        taskTitleInput.value = '';
        taskDescInput.value = '';
        taskTitleInput.focus();
        
        // Add event listeners
        const completeBtn = taskItem.querySelector('.complete-btn');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        
        completeBtn.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasks();
        });
        
        deleteBtn.addEventListener('click', () => {
            // Add fade-out animation before removal
            taskItem.style.animation = 'fadeOut 0.3s ease-out forwards';
            const handleAnimationEnd = () => {
                taskItem.removeEventListener('animationend', handleAnimationEnd);
                taskItem.remove();
                saveTasks();
            };
            taskItem.addEventListener('animationend', handleAnimationEnd);
        });
        
        // Save to localStorage
        saveTasks();
    }
    
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(task => {
            tasks.push({
                title: task.querySelector('.task-title').textContent,
                desc: task.querySelector('.task-desc')?.textContent || '',
                priority: task.querySelector('.task-priority').textContent.toLowerCase(),
                completed: task.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            JSON.parse(savedTasks).reverse().forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.classList.add('task-item');
                if (task.completed) taskItem.classList.add('completed');
                
                taskItem.innerHTML = `
                    <div class="task-content">
                        <h3 class="task-title">${task.title}</h3>
                        ${task.desc ? `<p class="task-desc">${task.desc}</p>` : ''}
                        <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    </div>
                    <div class="task-actions">
                        <button class="task-btn complete-btn" title="Complete">✓</button>
                        <button class="task-btn delete-btn" title="Delete">✕</button>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
                
                // Add event listeners
                const completeBtn = taskItem.querySelector('.complete-btn');
                const deleteBtn = taskItem.querySelector('.delete-btn');
                
                completeBtn.addEventListener('click', () => {
                    taskItem.classList.toggle('completed');
                    saveTasks();
                });
                
                deleteBtn.addEventListener('click', () => {
                    taskItem.style.animation = 'fadeOut 0.3s ease-out forwards';
                    const handleAnimationEnd = () => {
                        taskItem.removeEventListener('animationend', handleAnimationEnd);
                        taskItem.remove();
                        saveTasks();
                    };
                    taskItem.addEventListener('animationend', handleAnimationEnd);
                });
            });
        }
    }
});