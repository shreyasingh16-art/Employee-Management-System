const API_BASE_URL = "http://localhost:8080/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(responseText || `API Error: ${response.status}`);
    }

    if (!responseText) {
        return null;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
}

async function getEmployees() {
    return apiRequest("/employees");
}

async function addEmployee(employee) {
    return apiRequest("/employees", {
        method: "POST",
        body: JSON.stringify(employee)
    });
}

async function updateEmployee(id, employee) {
    return apiRequest(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify(employee)
    });
}

async function deleteEmployee(id) {
    return apiRequest(`/employees/${id}`, {
        method: "DELETE"
    });
}