import React, { useEffect, useState } from 'react';

const BreederPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const breederId = localStorage.getItem("breeder_user_id");
      const dontShow = localStorage.getItem("Breeder_guide_popup");
      if (breederId && dontShow !== "true") {
        setShowPopup(true);
      }
    }
  }, []);

  const handleDontShow = () => {
    localStorage.setItem("Breeder_guide_popup", "true"); // Save as string "true"
    setShowPopup(false);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    showPopup && (
      <div
        className="modal fade show"
        id="breeder-guide"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        style={{ display: 'block', background: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-dialog modal-dialog-edit" role="document">
          <div className="modal-content">
            <div className="modal-heading">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ background: 'url(/images/Nextpet-imgs/close-icon.svg)', backgroundSize:'contain'}}
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <form action="">
                <div className="breederform-popup-wrap">
                  <img 
                    src="images/Nextpet-imgs/popup-logo.png"
                    alt=""
                  />
                  <h1>Breeder Guide</h1>
                  <h3>Welcome to NextPet, Breeders!</h3>
                  <p>{`We're`} thrilled to have you join our community.</p>

                  <div className="breederimg-popup-wrap">
                    <img 
                      src="images/Nextpet-imgs/popup1.png"
                      alt="popup1"
                    />
                    <img 
                      src="images/Nextpet-imgs/popup2.png"
                      alt="popup2"
                    />
                    <img 
                      src="images/Nextpet-imgs/popup3.png"
                      alt="2"
                    />
                  </div>

                  <div className="agreed-wrap">
                    <input type="checkbox" onChange={handleDontShow} />
                    <span>{`Please don't show this again.`}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BreederPopup;
