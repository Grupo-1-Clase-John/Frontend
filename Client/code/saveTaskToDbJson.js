const saveTaskToDbJson = async (task) => {
    const dbUrl = `${apiUrl}Server/db.json`;
    const response = await fetch(dbUrl);
    if (!response.ok) {
        throw new Error(`No se pudo leer db.json: HTTP ${response.status}`);
    }

    const data = await response.json();
    const newTask = {
        ...task,
        userId: Number(task.userId) || task.userId
    };

    const updatedData = {
        ...data,
        tasks: Array.isArray(data.tasks) ? [...data.tasks, newTask] : [newTask]
    };

    const putResponse = await fetch(dbUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData, null, 2)
    });

    if (!putResponse.ok) {
        throw new Error(`No se pudo guardar en db.json: HTTP ${putResponse.status}`);
    }

    return newTask;
}

export { saveTaskToDbJson };