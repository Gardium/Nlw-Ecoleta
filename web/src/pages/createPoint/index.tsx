import React ,{useEffect,  useState, ChangeEvent,FormEvent}from 'react'
import {Link , useHistory} from 'react-router-dom'
import MaskedInput from 'react-text-mask'
import {FiArrowLeft} from 'react-icons/fi'
import { Map, TileLayer, Marker} from 'react-leaflet'
import{LeafletMouseEvent} from 'leaflet'
import axios from 'axios'


import './styles.css'
import logo from '../../assets/logo.svg'
import api from '../../services/api'
import Dropzone from '../../componentes/Dropzone'


interface Item{
    id:number;
    name: string;
    image_url:string;
}
interface ibgeUFResponse{
    sigla:string
}
interface ibgeCityResponse{
    nome:string
}
const CreatePoint = () =>{
    const [items,setItems] = useState<Item[]>([])
    const [Selecteditems,setselectedItems] = useState<number[]>([])

    const [formData,setFormData] = useState({
        name:'',
        email:'',
        whatsapp:''
    })
    
    const [InicialPosition , setInicialPosition]= useState<[number,number]>([0,0])

    const [UFs,setUFs] = useState<string[]>([])
    const [selectedUF,setselectedUF] = useState('0')
    const [selectedCity,setSelectedCity] = useState('0')
    const [cities,setCities] = useState<string[]>([])

    const [selectedFile, setSelectedFile] = useState<File>()

    const [selectedPosition , setSelectedPosition]= useState<[number,number]>(InicialPosition)
    const History = useHistory()
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position =>{
            const {latitude,longitude} = position.coords
            setInicialPosition ([latitude,longitude])
            setSelectedPosition ([latitude,longitude])

        })
    },[])
    useEffect(()=>{
        api.get('items').then(res =>{
            setItems(res.data)
        })
    },[])
    useEffect(()=>{
        axios.get<ibgeUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(res=>{
        const ufInitials =  res.data.map(uf=>uf.sigla)
        setUFs(ufInitials)

    })   
    },[])

 useEffect(() => {
     if (selectedUF ==='0') {return}
     axios.get<ibgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
    .then(res => {
        const cityNames =  res.data.map(city=>city.nome)
        setCities(cityNames)

 })
} ,[selectedUF])
 
function handleSelectedUF(event:ChangeEvent<HTMLSelectElement>){
     const uf = event.target.value
     setselectedUF(uf)

 }
 
 function handleSelectedCity(event:ChangeEvent<HTMLSelectElement>){
    const city = event.target.value
    setSelectedCity(city)
 
}

function handleMapClick(event:LeafletMouseEvent){
    if (selectedPosition ===InicialPosition){return}

   setSelectedPosition([
        event.latlng.lat,
        event.latlng.lng,

    ])
}
function handleInputChange(event:ChangeEvent<HTMLInputElement>){
    const {name, value } = event.target
    setFormData({...formData,[name]:value})
}

function handleSelectedItem(id:number){
    const AlreadySelected = Selecteditems.findIndex(item=>item === id)
    if(AlreadySelected >=0){
        const filteredItems = Selecteditems.filter(item=> item !== id)
        setselectedItems(filteredItems)
    }else{
    setselectedItems([...Selecteditems,id])

    }

}
async function handleSubmit(event:FormEvent){
    event.preventDefault()


    const {name,email,whatsapp} = formData
    
    const uf = selectedUF
    const city = selectedCity
    const  [latitude,longitude] = selectedPosition
    const items = Selecteditems
    if(name === ''|| whatsapp === ''|| email  === ''|| city  === '0'|| uf  === '0'){return alert('Preencha todos os campos')}
    if(latitude ===0){return alert('Selecione o endereço no mapa')}
    if(Selecteditems.length ===0){return alert('Selecione um ou mais itens de coleta')}
    if(!selectedFile){return alert('Adicione uma foto ao seu ponto de coleta')}


    const data =  new FormData()
    
        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))
        
        if(selectedFile){
            data.append('image', selectedFile)
        }



    
    await api.post('points', data)
    alert('Ponto de Coleta Criado com Sucesso')
    History.push('/')
}
return(

    <div id="page-create-point">
        <header>
            <img src={logo}alt="Ecoleta"/>
        <Link to="/">
            <FiArrowLeft/>Voltar para home
        </Link>

        </header>
        <form onSubmit={handleSubmit}>
            <h1>Cadastro do <br/>
             Ponto de coleta</h1>
             <Dropzone onFileUploaded = {setSelectedFile}/>

             <fieldset>
                 <legend>
                     <h2>Dados</h2>
                 </legend>
                 <div className="field">
                         <label htmlFor="name">Nome da entidade</label>
                         <input 
                         type="text"
                         name= 'name'
                         id='name'
                         onChange = {handleInputChange}
                         />
                     </div>
                     <div className="field-group">
                     
                     <div className="field">
                         <label htmlFor="email">E-mail</label>
                         <input 
                         type="text"
                         name= 'email'
                         id='email'
                         onChange = {handleInputChange}
                         />
                     </div>
                     <div className="field">
                         <label htmlFor="name">Whatsapp</label>
                         <MaskedInput 
                        mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/,/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                        className="form-control"
                        placeholder="Enter a phone number"
                        guide={false}
                        type="text"
                         name= 'whatsapp'
                         id='whatsapp'
                         onChange = {handleInputChange}
                         />
                     </div>

                     </div>
             </fieldset>

             <fieldset>
                 <legend>
                     <h2>Endereço</h2>
                     <span>Selecione o endereço no mapa</span>
                 </legend>
                 <Map center={InicialPosition}zoom={15} onclick ={handleMapClick}>
                 
                 <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          
          <Marker position = {selectedPosition}/>
            
                 </Map>
                 <div className="field-group">
                     
                     <div className="field">
                         <label htmlFor="uf">Estado (UF)</label>
                         <select
                          name="uf"
                          value= {selectedUF}
                          id="uf" 
                          onChange={handleSelectedUF}>
                             <option value="0" >Selecione uma UF</option>
                             {UFs.map(uf=>(<option value = {uf} key={uf}>{uf}</option>))}
                         </select>
                     </div>

                 <div className="field">
                         <label htmlFor="city">Cidade</label>
                         <select name="city" 
                         id="city"
                         onChange={handleSelectedCity}>
                             <option value='0'
                             >

                             Selecione uma cidade
                                 </option> 
                             {cities.map(city=>(<option value = {city} key={city}>{city}</option>))}

                         </select>
                     </div>
                     
                 </div>

             </fieldset>

             <fieldset>
                 <legend>
                     <h2>Ítems de coleta</h2>
                     <span>Selecione um ou mais itens abaixo</span>
                 </legend>
                 <ul className="items-grid">
                     {items.map(item =>( 
                          <li onClick={()=> handleSelectedItem(item.id)} 
                           key={item.id}
                           className = {Selecteditems.includes(item.id)?'selected':''}>
                         <img src={item.image_url} alt={item.name}/>
                     <span>{item.name}</span>
                     </li>))}
                   
                    
                   
                 </ul>
             </fieldset>
            <button type="submit">Cadastrar Ponto de Coleta</button>
        </form>
    </div>
)
}

export default CreatePoint