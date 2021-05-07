import React, {Component} from 'react'
import Main from '../template/main'
import axios from 'axios'


const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir'
}

const baseUrl = 'http://localhost:3001/users'
const initialState = {
    user: {name: '', email: '', endereco: '', telefone: ''},
    list: []
}

export default class UserCrud extends Component {

    state = {...initialState}

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState( {list: resp.data })
        })
    }

    clear() {
        this.setState( {user: initialState.user })
    }

    save() {
        const user = this.state.user
        const method = user.id ? 'patch' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` :  baseUrl
        
        axios[method](url, user) 
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState( {user: initialState.user, list})
            })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        user[event.target.email] = event.target.value
        user[event.target.endereco] = event.target.value
        user[event.target.telefone] = event.target.value
        this.setState({user})
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control" 
                            name="name" value={this.state.user.name} onChange={e => this.updateField(e)}
                            placeholder="Digite o nome"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="form-control"
                            name="email" value={this.state.user.email} onChange={e => this.updateField(e)}
                            placeholder="Digite o email"/>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Endereco</label>
                            <input type="text" className="form-control" 
                            name="endereco" value={this.state.user.endereco} onChange={e => this.updateField(e)}
                            placeholder="Digite o endereço"/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" className="form-control"
                            name="telefone" value={this.state.user.telefone} onChange={e => this.updateField(e)}
                            placeholder="Digite o telefone"/>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save(e)}> 
                            Salvar
                        </button>

                        <button className="btn btn-secundary" onClick={ e=>this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState( {user} )
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then( resp=> {
            const list = this.getUpdatedList(user, false)
            this.setState({list})
        })
    }
    
    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.endereco}</td>
                    <td>{user.telefone}</td>
                    <td>
                        <button className="btn btn-primary " onClick={()=> this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        


        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}