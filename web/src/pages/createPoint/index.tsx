import React, { useEffect, useState, ChangeEvent , FormEvent} from 'react'
import './styles.css'
import { Link, useHistory } from'react-router-dom'
import logo from '../../assets/logo.svg'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from '../../services/api'
import { LeafletMouseEvent} from 'leaflet'
import DropZone from '../../components/dropzone'
import Dropzone from '../../components/dropzone'

/* 
    Array ou objeto, precisa informar manualmente o tipo da variável
*/

// Para aprender sobre React com typescript, no browser: typescript react cheat sheet
// está no github.com

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUfResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {

    const [ items, setItems ] = useState<Item[]>([])
    const [ ufs, setUfs ] = useState<string[]>([])
    const [ towns, setTowns ] = useState<string[]>([])
    const [ selectedUf, setSelectedUf ] = useState('0')
    const [ selectedCity, setSelectedCity ] = useState('0')
    const [ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0, 0])
    const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0, 0])
    const [ selectedItems, setSelectedItems ] = useState<number[]>([])
    const [ formData, setFormData ] = useState({ name: '', email: '', whatsapp: '' })
    const [ selectedFile, setSelectedFile ] = useState<File>()

    const history = useHistory()

    useEffect(() => { 

        const getItems = async () => {
            const response = await api.get('items')
            setItems(response.data)
        }

        getItems()
    }, [])

    useEffect(() => {

        const getEstados = async () => {
            const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            const estados = await response.json()
            
            const UfInittials = estados.map( (uf: IBGEUfResponse) => uf.sigla)
            setUfs(UfInittials)
        }
        getEstados()
    },[])

    useEffect(() => {
        // carregar as cidades sempre que a uf mudar

        if (selectedUf === '0') return

        const getCidades = async () => {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            const towns = await response.json()

            const townsNames = towns.map( (town: IBGECityResponse) => town.nome)
            setTowns(townsNames)
        }
        getCidades()
    }, [selectedUf])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([ latitude, longitude ])
        })
    }, [])

    const handleSelectUf = (e: ChangeEvent<HTMLSelectElement>) => {
        const uf = e.target.value
        setSelectedUf(uf)

    }
    const handleSelectCity = (e: ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value
        setSelectedCity(city)

    }

    const handleMapClick = (e: LeafletMouseEvent) => {
        setSelectedPosition([ e.latlng.lat, e.latlng.lng ])
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSelectItem = (id: number) => {

        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)

            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([ ...selectedItems, id ])
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        
        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [ latitude, longitude ] = selectedPosition
        const items = selectedItems

        const data = new FormData()
        
            data.append('name', name) 
            data.append('email', email )
            data.append('whatsapp', whatsapp) 
            data.append('uf', uf)
            data.append('city', city )
            data.append('items', items.join(','))
            data.append('latitude', String(latitude) )
            data.append('longitude', String(longitude))
            
            if (selectedFile)
            data.append('image', selectedFile)

        api.post('points', data)

        alert('Ponto de coleta criado.')

        history.push('/')
    }
    
    return (
       <div id="page-create-point">
           <header>
               <img src={logo} alt="Ecoleta"/>
               <Link to="/">
                   <FiArrowLeft/>
                   Voltar para Home
                   </Link>
           </header>
           <form onSubmit={handleSubmit}>
               <h1>Cadastro do <br/> ponto de coleta</h1>

               <Dropzone onFileUploaded={setSelectedFile}/>

               <fieldset>
                   <legend>
                       <h2>Dados</h2>
                   </legend>

                   <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                        type="text" 
                        name="name" 
                        id="name"
                        onChange={handleInputChange}
                        />
                   </div>

                   <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                            type="email" 
                            name="email" 
                            id="email"
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                            type="text" 
                            name="whatsapp" 
                            id="whatsapp"
                            onChange={handleInputChange}
                            />
                        </div>
                   </div>

               </fieldset>

               <fieldset>
                   <legend>
                       <h2>Endereço</h2>
                       <span>Selecione o endereço no mapa</span>
                   </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>
                   <div className="field-group">
                       <div className="field">
                           <label htmlFor="uf">Estado (uf)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                       </div>
                       <div className="field">
                           <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {towns.map(townName => (
                                    <option key={townName} value={townName}>{townName}</option>
                                ))}
                            </select>
                       </div>
                   </div>
               </fieldset>

               <fieldset>
                   <legend>
                       <h2>Itens de coleta</h2>
                       <span>Selecione um ou mais itens abaixo</span>
                   </legend>

                   <ul className="items-grid">
                       {items.map(item => {
                           return (
                            <li key={item.id} 
                            className={selectedItems.includes(item.id) ? 'selected' : ''} 
                            onClick={() => handleSelectItem(item.id)}> 
                                <img src={item.image_url} alt={item.title}/>
                           <span>{item.title}</span>
                            </li>
                           )
                       })}
                        
                   </ul>
               </fieldset>
               <button type="submit">
                   Cadastrar ponto de coleta
               </button>
           </form>
       </div>
    )
}

export default CreatePoint