import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ImportPSTS() {
    const navigate = useNavigate()
    const dvRef = useRef();
    const [pstsFileName, setPstsFileName] = useState(null)
    const [pstsFileData, setPstsFileData] = useState(null)

    const handlePSTSFile = (event) => {
        var url = URL.createObjectURL(event.target.files[0]);
        setPstsFileName(event.target.files[0].name)
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
          setPstsFileData(e.target.result);
          const st = {
            matchId:null,
            pstsFileData:e.target.result, 
          }
          navigate('/match', { state:st })
        };
      };
    
    return (
    <>
      <div className="flex my-4">
        <input
          type="file"
          id="selectedPSTSFile"
          ref={dvRef}
          style={{ display: "none" }}
          onChange={handlePSTSFile}
          onClick={(event) => {
            event.target.value = null;
          }}
        />
        <input
          type="button"
          className="btn btn-sm w-60"
          value="Load PSTS file..."
          onClick={() => document.getElementById("selectedPSTSFile").click()}
        />
        <label className="label ml-4">
          <span className="label-text">
            {pstsFileName === null ? "load a local PSTS file" : pstsFileName}
          </span>
        </label>
      </div>
    </>
  );
}

export default ImportPSTS;
