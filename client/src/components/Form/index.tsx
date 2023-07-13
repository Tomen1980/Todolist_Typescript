import React from 'react'
import { Transition } from 'react-transition-group'
import CloseSvgComponent from 'assets/svg/close'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { useMutation,useQueryCache } from 'react-query'
import { postTodo } from 'api/postTodo'

type Props ={
    inProp:boolean,
    onClose: () => void
}

type Inputs = {
    title : string,
    status: 'completed' | 'uncompleted'
}

const DURATION = 240

const formDefaultStyle = {
  transition: `bottom ${DURATION}ms ease-in-out, opacity ${DURATION * 2}ms ease-in-out`,
  opacity: 0,
  bottom: '-180px'
}

const overlayDefaultStyle = {
  transition: `bottom ${DURATION}ms ease-in-out, opacity ${DURATION * 2}ms ease-in-out`,
  opacity: 0,
  display: 'none'
}

const formTransitionStyles = {
  unmounted: { bottom: '-180px', opacity: 0 },
  entering: { bottom: 0, opacity: 1 },
  entered:  { bottom: 0, opacity: 1 },
  exiting:  { bottom: '-180px', opacity: 0 },
  exited:  { bottom: '-180px', opacity: 0 },
}

const overlayTransitionStyles = {
  unmounted: { bottom: '-180px', opacity: 0 },
  entering: { display: 'block', opacity: .85 },
  entered:  { display: 'block', opacity: .85 },
  exiting:  { bottom: '-180px', opacity: 0 },
  exited:  { bottom: '-180px', opacity: 0 },
}
  
const Form: React.FC<Props> =({inProp,onClose})=>{
    const cache = useQueryCache()
    const {register,handleSubmit,errors,reset} = useForm<Inputs>()

    const [mutate] = useMutation(postTodo,{
        onSuccess: ()=>{
            cache.invalidateQueries('todos')
        }
    })

    const onSubmit = async (data: Inputs):Promise<void>=>{
        try{
            await mutate(data)
            reset()
        }catch(error){
            throw new Error
        }
    }



    const handleOnClose = ()=>{
        reset()
        onClose()
    }
    const placeholderStyle = classnames('text-darkPurple flex-1 bg-transparent outline-none',{
        'placeholder-red-400': errors.title
    })

    const inputStyle = classnames('flex justify-center items-center bg-gray-200 px-4 py-2 rounded-lg box-border', {
        'bg-red-200': errors.title
      })
    
    return(
       <Transition in = {inProp} timeout={DURATION}>
        {(state)=>{
            return(
             <>

                <div 
                    onClick={onClose}
                    style={{
                        ...overlayDefaultStyle,
                        ...overlayTransitionStyles[state]
                    }}
                    className="fixed left-0 top-0 bottom-0 right-0 bg-black"
                />

             <div 
                style={{
                    ...formDefaultStyle,
                    ...formTransitionStyles[state]
                }}
             className="fixed flex flex-col z-10 inset-x-0 rounded-t-lg p-4 h-32 bg-white">
             <form 
                onSubmit={handleSubmit(onSubmit)}
                className={inputStyle}>
                 <input 
                ref={register({
                        required: { 
                        value: true,
                        message: 'This field is required!'
                        },
                        maxLength: {
                        value: 30,
                        message: 'No more thant 30 characters!'
                        },
                        minLength: {
                        value: 8,
                        message: 'Minimum characters is 8!'
                        }
                    })}
                 name='title' 
                 placeholder={errors.title ? "oops!":"Isi todo anda"} 
                 className={placeholderStyle}/>
                 <input ref={register} name='status' defaultValue="uncompleted"  className='hidden'/>
                    
                  {errors.title?(
                    <button 
                    onClick={()=>reset()}
                    className='bg-transparent text-md font-bold text-darkPurple outline-none ml-1'>
                    Reset
                    </button>
                  ):(
                    <input 
                    type="submit"
                    value="add"
                    className="bg-transparent text-md font-bold text-darkPurple outline-none ml-1"
                     />
                  )}  
                 
 
             </form>
                    {errors.title && (
                        <span className="bg-transparent text-md font-bold text-red-600 outline-none ml-1">{errors?.title?.message}</span>
                    )}

             <span
                onClick={handleOnClose}
                 className="absolute transform -translate-x-1/2 -translate-y-1/2"
                 style={{
                   bottom: '10px',
                   left: '50%'
                 }}>
                 <CloseSvgComponent />
               </span>
 
         </div>
             </>
        )}}
       </Transition>
    )
}

export default Form