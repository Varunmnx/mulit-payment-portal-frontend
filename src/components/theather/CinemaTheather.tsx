import SeatsCanvas from './SeatsCanvas'

const CinemaTheather = () => {
  return (
    <div>
        <SeatsCanvas />
        <button className='bg-red-500/100 text-white font-bold py-2 px-4 rounded'>
          Book now
        </button>
    </div>
  )
}

export default CinemaTheather