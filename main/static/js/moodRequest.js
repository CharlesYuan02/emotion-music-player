Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach('#imageCapture');

document.querySelector('#new_mood_button').addEventListener('click', function () {
    getExpression();
});    

const getExpression = () => {
    Webcam.snap( image_uri => {
        fetch('/expression', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"image_uri": image_uri})
        }).then( response => {
            return response.json();
        }).then( res => {
            const mood = res.mood;
            console.log(mood)
            // do other stuff with mood here if needed
        });             
    });
}