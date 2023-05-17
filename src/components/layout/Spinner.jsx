import BouncingTennisBall from "../../assets/BouncingTennisBall.gif"

function Spinner() {
  return (
    <div className='w-100 mt-20'>
      <img
        width={180}
        className='text-center mx-auto'
        src={BouncingTennisBall}
        alt='Loading...'
      />
    </div>
  )
}

export default Spinner
