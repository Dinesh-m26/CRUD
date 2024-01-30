
import { useEffect, useState } from 'react'
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core'
import './App.css';

const AppToaster = Toaster.create({
    position: 'top'
})


function App() {
    const [data, setData] = useState([])
    const [newname, setNewname] = useState('')
    const [newemail, setNewemail] = useState('')
    const [newwebsite, setNewwebsite] = useState('')

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((value) => value.json())
            .then((json) => setData(json))
    }, [])

    function adduser() {
        const name = newname.trim();
        const email = newemail.trim();
        const website = newwebsite.trim();

        console.log("name", name)
        console.log("email", email)
        console.log("website", website)

        if (name && email && website) {
            fetch('https://jsonplaceholder.typicode.com/users',
                {
                    method: "POST",
                    body: JSON.stringify({
                        name, email, website
                    }),
                    headers: { "Content-Type": "application/json; charset=UTF-8" }
                }
            ).then((Response) => Response.json())
                .then((newdata) => {
                    setData([...data, newdata]);
                    AppToaster.show({
                        message: "user added successfully",
                        intent: 'success',
                        timeout: 1000
                    })
                    setNewname("")
                    setNewemail("")
                    setNewwebsite("")

                })

        }

    }
    function onChangeHandle(id, key, value) {
        setData((data) => {
            return data.map((user) => {
                return user.id === id ? { ...user, [key]: value } : user
            })
        })
    }
    function updateuser(id) {
        const datas = data.find((data) => data.id === id)

        fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    datas
                }),
                headers: { "Content-Type": "application/json; charset=UTF-8" }
            }
        ).then((Response) => Response.json())
            .then((newdata) => {
                AppToaster.show({
                    message: "user updated successfully",
                    intent: 'success',
                    timeout: 1000
                })
            })
    }

    function deleteuser(id) {
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
            {
                method: "DELETE"
            })
            .then((Response) => Response.json())
            .then((newdata) => {
               setData((data)=>{
               return data.filter((data) => data.id !== id)
               })
                AppToaster.show({
                    message: "user deleted successfully",
                    intent: 'success',
                    timeout: 1000
                })
            })
    }

    return (
        <div className='App'>
            <div><h1>User Management Dashboard with CRUD</h1></div>
            <div className="Table">
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Website</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {data.map(data =>
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td><EditableText onChange={changes => onChangeHandle(data.id, "email", changes)} value={data.email} /></td>
                                <td><EditableText onChange={changes => onChangeHandle(data.id, "website", changes)} value={data.website} /></td>
                                <td><Button intent='primary' onClick={() => updateuser(data.id)}>Update</Button>
                                   &nbsp;<Button intent='danger' onClick={() => deleteuser(data.id)}>Delete</Button></td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td>
                                <InputGroup

                                    value={newname}
                                    onChange={(e) => setNewname(e.target.value)}
                                    placeholder='Enter Name...'
                                />
                            </td>
                            <td>
                                <InputGroup

                                    value={newemail}
                                    onChange={(e) => setNewemail(e.target.value)}
                                    placeholder='Enter Email...'
                                />
                            </td>
                            <td>
                                <InputGroup

                                    value={newwebsite}
                                    onChange={(e) => setNewwebsite(e.target.value)}
                                    placeholder='Enter Website...'
                                />
                            </td>
                            <td><Button intent='success' onClick={adduser}>Add user</Button></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
export default App;
