import React from 'react'

const BreederGuide = () => {
  return (
    <div className="modal fade" id="breeder-guide2" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div className="modal-dialog modal-dialog-edit" role="document">
      <div className="modal-content">
        <div className="modal-heading">
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">

          <form action="">
            <div className="breederform-popup-wrap">
              <img src="images/Nextpet-imgs/envelope.svg" alt="img"/>
              <h1 className="pt-4">Contact Breeder</h1>
              <p>You are going to contact the breeder of this post. In doing so, your contact information will be shared
                to the breeder.</p>
              <h4>Hurry up! 21 users have already contacted the breeder for this pet.</h4>
              <div className="agreed-wrap">
                <input type="checkbox"/>
                <span>Do not show me this message again.</span>
              </div>
              <div className="userpopup-btn-wrap">
                <button type="button" className="inactive" value="Submit" data-bs-dismiss="modal" aria-label="Close">Not
                  Yet</button>
                <button type="button" value="Submit" data-bs-target="#breeder-information-user" data-bs-toggle="modal"
                  data-bs-dismiss="modal" aria-label="Close">Contact Breeder</button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
  )
}

export default BreederGuide
