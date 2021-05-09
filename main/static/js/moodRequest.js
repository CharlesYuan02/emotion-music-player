Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach('#imageCapture');

document.querySelector('#test').addEventListener('click', function () {
    getExpression();
});    

const getExpression = () => {
    Webcam.snap( image_uri => {
        console.log(image_uri)
        fetch('/expression', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({image_uri: image_uri})
        }).then( response => {
            return response.json();
        }).then( res => {
            const mood = res.mood;
            document.querySelector('#status').innerHTML = `Current Mood: ${mood}`;
            // do other stuff with mood here (e.g. determine the song on a mood change)
        });             
    });
}