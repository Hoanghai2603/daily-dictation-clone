async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3001/api/users');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(error);
    }
}

fetchUsers();
