import React from 'react'
import Input from './Input'
import { Button } from './ui/button'
import useForm from '@/hooks/useForm'
import { UserContext } from '@/context/UserStorage'
import { dadosExemplo, dadosInputField, responseMetodostype } from '@/types/userTypes'
import { DateContext } from '@/context/DateStorage'

interface InputFieldProps {
    id: number|null;
    tipo: string;
    dados?: dadosInputField;
}

function InputField({ id }: InputFieldProps) {
    const { 
        tipo,
        criarTrans,
        pegarBalanco,
        setTipo,
        pegarMetodos,
        pegarCategorias,
        setBalance,
        editTrans,
        setDadosretorno,
        setDadosBusca,
        setEditModal,
        setDeleteModal,
        setInflows,
        setOutflows,
        pegarEntradas,
        pegarSaidas,
        setCreateModal,
        dadosRetorno,
    } = React.useContext(UserContext);

    const {startDate, endDate, getTransByDate} = React.useContext(DateContext)

    const description = useForm();
    const price = useForm();
    const dataTransacao = useForm();
    const [metodo, setMetodo] = React.useState<Array<string>>([]);
    const [categList, setCategList] = React.useState<Array<string>>([]);

    const [type, setType] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [metodoPagemento, setMetodoPagamento] = React.useState('');

    const tipoList = ['E', 'S'];
    const metodosList = ['Tipo Pagamento'];
    const categoriaList = ['Categoria'];

    async function getMetodos() {
        const token = window.localStorage.getItem('accessToken')
        if (token) {
            let responseMetodos: Array<responseMetodostype> = await pegarMetodos(token);
            if (metodosList.length === 1) {
                responseMetodos.forEach((metod) => { metodosList.push(metod.name) })
                setMetodo(metodosList);
            }
        }
    }
    async function getCategorias() {
        const token = window.localStorage.getItem('accessToken')
        if (token) {
            let responseCategorias: Array<responseMetodostype> = await pegarCategorias(token);
            if (categoriaList.length === 1) {
                responseCategorias.forEach((categoria) => { categoriaList.push(categoria.name) })
                setCategList(categoriaList)
            }
        }
    }
    async function handleSubmit(event: any) {
        event.preventDefault();
        const token = window.localStorage.getItem('accessToken') ?? "";

        const load = async () => {
            if (token && id != 156484651894 && tipo == 'editar') {
                await editTrans(description.value, price.value, category, type, metodoPagemento, token, id||0);
            }
            if (token && tipo == 'criar') {
                if (description.validate() && price.validate() && category) {
                    await criarTrans(description.value, price.value, category, type, dataTransacao.value, metodoPagemento, token);
                }
            }
            setDadosBusca(await getTransByDate(startDate,endDate,token))
            setBalance(await pegarBalanco(startDate,endDate,token))
            setInflows(await pegarEntradas(startDate,endDate,token))
            setOutflows(await pegarSaidas(startDate,endDate,token))
            description.setValue('')
            price.setValue('')
            setCategory('')
            setMetodoPagamento('')
            setType('')
            setCategory('');
            setEditModal(false)
            setDeleteModal(false)
            setCreateModal(false)
            if (setDadosretorno) setDadosretorno(dadosExemplo)
            setTipo('criar')
            }
        load()
    }

    React.useEffect(() => {
        const token = window.localStorage.getItem('accessToken') ?? "";
        const load = async () => {
            setBalance(await pegarBalanco(startDate, endDate, token))
            await getCategorias()
            await getMetodos()
        }
        load()
    }, [])

    React.useEffect(() => {
        if (dadosRetorno) {
            price.setValue(dadosRetorno.price || 0)
            description.setValue(dadosRetorno.description || '')
            setCategory(dadosRetorno.category || '')
            setMetodoPagamento(dadosRetorno.metodoPagamento || '')
            setType(dadosRetorno.type || '')
        }
    }, [dadosRetorno])

    return (
        <form className={`'flex flex-col items-start justify-center'}`}
            onSubmit={handleSubmit} >
            <Input label="Descrição" type="text" name="descriptio" {...description} />
            <Input label="Preço" type="number" name="price" {...price} />
            <Input label="Data" type="date" name="data" {...dataTransacao} />
            <select title='Categorias' className={'h-10 rounded-md p-2'} value={category || ''} onChange={(e) => setCategory(e.target.value)}>
                {categList.map((tipo: string, id: number) => (
                    <option key={id} value={tipo || ''}>
                        {tipo || ''}
                    </option>
                ))}

            </select>
            <select title='Metodos de pagamento' className={'h-10 rounded-md p-2 mb-4'} value={metodoPagemento || ''} onChange={(e) => setMetodoPagamento(e.target.value)}>
                {metodo.map((tipo: string, id: number) => (
                    <option key={id} value={tipo || ''}>
                        {tipo || ''}
                    </option>
                ))}
            </select>
            <select title='Tipo de transação' className={'h-10 rounded-md p-2 mb-4'} value={type || ''} onChange={(e) => setType(e.target.value)}>
                <option value="">Tipo transação</option>
                {tipoList.map((tipo: string, id: number) => (
                    <option key={id} value={tipo || ''}>
                        {tipo || ''}
                    </option>
                ))}
            </select>

            <Button className=''> Enviar </Button>
        </form>
    )

}
export default InputField;