// time trigger event that will run the function every 5 mins 
function Trigger() {
  ScriptApp.newTrigger('makePDF')
      .timeBased().everyMinutes(5)
      .create();
}

function makePDF() {
  // REPLACE WITH GOOGLE SLIDES ID
  const googleSlidesId = "REPLACE WITH GOOGLE SLIDES ID"
  // REPLACE WITH THE ID OF BACKUP SLIDES
  const constructionSlideId = "REPLACE WITH THE ID OF BACKUP SLIDES"
  // REPLACE WITH ID OF THE FILE THAT YOU WANT TO UPDATE
  const updateFileID = "REPLACE WITH ID OF THE FILE THAT YOU WANT TO UPDATE"
  // get Slides by googleSlidesId from SlidesApp 
  const slidesObject = SlidesApp.openById(googleSlidesId)
  // get all slides from googleSlides
  const slides = slidesObject.getSlides()
  // create Empty Slides named tempSlides
  let tempSlides = SlidesApp.create("tempSlides")
  // by default the frist slide will be just an empty slide but we don't need the frist emptyslide so we just delete it.
  tempSlides.getSlides()[0].remove()
  
  // looping through slides
  for(let i = 0 ; i<slides.length ; i++){
    const slide = slides[i]
    // Logger.log(slide.getObjectId())
    // if the loop run to first slides of backup slide then we just break the loop
    if(slide.getObjectId() === constructionSlideId){
      break;
    }
    // copy the first slide to the slide before the backup slide
    tempSlides.appendSlide(slide)
  }
  // save tempSlides
  tempSlides.saveAndClose()
  // get tempSlides file
  const tempSlidesFile = DriveApp.getFileById(tempSlides.getId())
  // update the file by id
  const updateFile = DriveApp.getFileById(updateFileID)
  Drive.Files.update({title: updateFile.getName(),mimeType:updateFile.getMimeType()}
  ,updateFile.getId(),tempSlidesFile.getBlob(),
  {supportsTeamDrives: true})
  // delete tempSlide 
  tempSlidesFile.setTrashed(true)
}
