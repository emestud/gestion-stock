import Spin from '../../assets/loading-response.gif'

const Spinner = () => {

    return (
        <div className="relative m-auto pt-24 flex flex-col justify-center items-center gap-12">
            <img src={Spin} alt="spin loading" />
            <h3 className='text-lg md:text-xl lg:text-2xl'>Chargement...</h3>
        </div>
    )
}

export default Spinner