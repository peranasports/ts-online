import EventList from "./EventList"
import PropTypes from 'prop-types'

function SetItem({ set, handleItemClicked }) {
  const {
    id,
    number,
    playerScore,
    oppositionScore,
    events,
  } = set

  return (
    <div className='text-lg pl-2 pb-2 font-bold text-left'>
      {/* SET {number}:&nbsp;&nbsp;&nbsp;{playerScore} - {oppositionScore} */}
      <EventList tennisevents={events}
        handleItemClicked={(tennisevent) => handleItemClicked(tennisevent)}
      />
    </div>
  )
}

SetItem.propTypes = {
  set: PropTypes.object.isRequired,
}

export default SetItem
