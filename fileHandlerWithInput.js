
let input = document.createElement('input');
input.setAttribute('type','file');
document.body.append(input);

// input.onchange = ()=> {
//     let reader = new FileReader();
//     reader.readAsDataURL(input.files[0]);
//     reader.onload = () => document.body.append(<img src={reader.result}/>);
// }

// input.onchange = ()=> {
//     let reader = new FileReader();
//     reader.readAsText(input.files[0]);
//     reader.onload = () => console.log( reader.result.split('\n').reduce((res,el,i)=>~el.indexOf('word') ? [...res,i+1] : res, []) );
// }

input.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = () => {
        
        let img = new Image();
        img.src=reader.result;
        img.onload = () => {

            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            
            let imageData = context.getImageData(0,0, canvas.width, canvas.height);
            
            //making black&white
            let data = imageData.data;
            for ( let i=0; i<data.length; i+=4 ) {
                let avg = data[i]+data[i+1]+data[i+2] / 3;
                data[i] = avg;
                data[i+1] = avg;
                data[i+2] = avg;
            }
            context.putImageData(imageData, 0, 0);
            //making black&white

            canvas.toBlob(blob=>{
                const form = new FormData();
                form.append('image', blob, 'bw.jpg');
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload', true);
                xhr.send(form);
            });
            document.body.append(canvas);
        }
        
    }
}
