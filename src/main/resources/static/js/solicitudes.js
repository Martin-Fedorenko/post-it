export async function tieneQueRegistrar(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/tieneQueRegistrar');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return !!data;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export async function registrar(datos) {
    try {
        const url = new URL('http://localhost:8080/registrar');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(await response.text());
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

export async function buscar(nombreBuscado) {
    try {
        const url = new URL('http://localhost:8080/buscar');
        url.searchParams.append('nombrePersona', nombreBuscado);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function perfil(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/perfil');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function amigos(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/amigos');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function sugerir(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/sugerir');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function eliminarAmigo(datos) {
    try {
        const url = new URL('http://localhost:8080/eliminarAmigo');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(await response.text());
        console.log("elimine amigos");

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function agregarAmigo(datos) {
    try {
        const url = new URL('http://localhost:8080/agregarAmigo');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(await response.text());
        console.log("agregue amigos");

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function publicar(datos) {
    try {
        const url = new URL('http://localhost:8080/publicar');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(await response.text());
        console.log("publicacion publicada!");

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function comentar(datos) {
    try {
        const url = new URL('http://localhost:8080/comentar');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(await response.text());
        console.log("comentario publicada!");

    } catch (error) {
        console.error('Error:', error);
    }
}

export async function sugerirPublicaciones(idUsuario) {
    try {
        const url = new URL('http://localhost:8080/sugerirPublicaciones');
        url.searchParams.append('idUsuario', idUsuario);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Las publicaciones son:");
        console.log(data);
        return data;

    } catch (error) {
        console.error('Error:', error);
    }
}