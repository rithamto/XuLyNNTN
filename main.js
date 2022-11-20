import { MauCauTu } from './template/MauCauTu.js';
import { MauCauGiaThietGiaTri} from './template/MauCauGiaTri.js';
import { MauCauHinh } from './template/MauCauHinh.js';
import { BieuThuc} from './template/BieuThuc.js';
import { MauCauKetLuan } from './template/MauCauKetLuan.js'; 
import { MauCauChungMinh } from './template/MauCauChungMinh.js';

let DeBai = document.querySelector('.debai');
let GiaThiet = document.querySelector('.giathiet');
let KetLuan = document.querySelector('.ketkuan');
const btnKetQuan = document.querySelector('.thuchien');


// TODO: Khai báo và gán các data text 
let DSTuXoa = convertStrtoArray( readTextFile('data/TuXoa.txt'),';');
let QuyUocChung = XuLyQuyUoc('data/QuyUoc.txt');
// console.log(QuyUocChung);

/* =================================
Sự kiện click thực hiện chương trình
====================================*/
btnKetQuan.addEventListener('click', function(e){
    e.preventDefault();

    // Xóa các ký hiệu 
    const debaiStr = XoaCacKyHieu(DeBai.value);
    //Chuyển đổi Quy ƯỚC
    const debaiStrQuyUoc = XuLyChuyenDoiQuyUoc(debaiStr, QuyUocChung);
    // Xóa các từ thừa
    const debaiStrXoaTuThua = XoaTuThua(debaiStrQuyUoc);
    console.log(debaiStrXoaTuThua);
// TODO: Xử lý nhận dạng tách thành 2 phần GIẢ THIẾT và KẾT LUẬN
    const {GiaThietTemp, KetLuanTemp} = TachGiathietKetLuan(debaiStrXoaTuThua);
    GiaThiet.value = GiaThietTemp;
    KetLuan.value = KetLuanTemp;
// TODO: Xử lý phần GIẢ THIẾT
    XuLyGiaThiet(GiaThietTemp);
// TODO: Xử lý phần KẾT LUẬN
    XuLyKetLuan(KetLuanTemp);

})

/* =================================
Xác định phần giả thuyết và kết luận dựa vào các từ đăc trưng và đồng nghĩa
====================================*/
function TachGiathietKetLuan(str){
    let strKetLuanTemp;
    let strGTTemp = convertStrtoArray(str.trim(),' ');
    // console.log(strGTTemp)
    let wordTach = convertStrtoArray(readTextFile('data/QuyUocTachGTKL.txt'), ';');
    let breakPoint, checkExit = false;

    for(let i= 0; i< wordTach.length; i++){

        for(let j = 0; j< strGTTemp.length; j++){
            if(strGTTemp[j] === wordTach[i]){
                breakPoint = j;
                checkExit = true;
                break;
            }
        }

        if(checkExit) break;
    }
    //console.log(breakPoint);

    strKetLuanTemp = strGTTemp.slice(breakPoint);
    let breakPointKL, checkGTBoSung = false;
    for(let x = 0; x < strKetLuanTemp.length; x++){
        if(strKetLuanTemp[x].match(/[b]iết/)){
            breakPointKL = x;
            checkGTBoSung = true;
            break;
        }
    }
    let strGTBoSung = [];
    if(checkGTBoSung){
        strGTBoSung = strKetLuanTemp.slice(breakPointKL, strKetLuanTemp.length);
        strKetLuanTemp = strKetLuanTemp.slice(0,breakPointKL);
    }
    // console.log(strKetLuanTemp);
    // console.log(strGTBoSung);


    return {
        'GiaThietTemp': strGTTemp.slice(0,breakPoint).join(' ') +' '+strGTBoSung.join(' '),
        'KetLuanTemp': strKetLuanTemp.join(' ')
    }

}


function XuLyGiaTriDaBiet(arrGiaTri){
    let arrGoc;
    for(let i = 0; i < arrGiaTri.length; i++){
        if(arrGiaTri[i].match(/[Gg]óc/g)){
            arrGoc = convertStrtoArray(arrGiaTri[i].replace(/[Gg]óc/,'').trim()," ");
            let temp = 'Góc(' + arrGoc[0] + ')' +arrGoc[1]+ arrGoc[2];
            arrGiaTri[i] =  temp;
        }
    }


    return arrGiaTri;
}


/* ================================
    XỬ LÝ PHẦN GIẢ THIẾT 
==============(======================*/
function XuLyGiaThiet(giathiet) {
  
    console.log(giathiet)

    let BieuThucKQ = [], regdexBieuThuc, strBieuThuc;
    for(let n = 0; n < BieuThuc.length; n++){
        regdexBieuThuc = new RegExp(BieuThuc[n],'g')
        if(giathiet.match(regdexBieuThuc)){
            BieuThucKQ.push(...giathiet.match(regdexBieuThuc));
            giathiet = giathiet.replace(regdexBieuThuc,"");
        } else continue;
    }
    // console.log(BieuThucKQ);


    let LocGiaTri = [],LocCauMau = [], rexdegGiaTri, rexDegCau , CauDaTrung,MauCau, LocCauMauTemp = [];
    
    for(let i = 0; i < MauCauGiaThietGiaTri.length; i++){
        rexdegGiaTri = new RegExp(MauCauGiaThietGiaTri[i],'g');
        // console.log(rexdegGiaTri);
        if(giathiet.match(rexdegGiaTri)){
            // console.log(giathiet.match(rexdegGiaTri));
            LocGiaTri.push(...giathiet.match(rexdegGiaTri));
            giathiet = giathiet.replace(rexdegGiaTri,"");
        } else continue;
    }
    // console.log(MauCauTu);
    // console.log(LocGiaTri);
    XuLyGiaTriDaBiet(LocGiaTri);
    for(let j = 0;j < MauCauTu.length; j++){
        rexDegCau = new RegExp(MauCauTu[j][0],'g');
        if(giathiet.match(MauCauTu[j][0])){
            CauDaTrung = giathiet.match(rexDegCau);
            MauCau = (MauCauTu[j][1]);
            LocCauMauTemp.push(CauDaTrung);
            LocCauMauTemp.push(MauCau);
            LocCauMau.push(LocCauMauTemp);
            giathiet = giathiet.replace(rexDegCau,"");
            LocCauMauTemp = [];
        } else continue;
    }
    // console.log(LocCauMau);
    let KetQuaCau = [], arrTemp, arrNameTemp = [], strKetQua, x = 0, regdexNum;
    // console.log(LocCauMau);
    for(let a = 0; a < LocCauMau.length; a++){
    //    console.log(LocCauMau[a]);
    //    console.log(LocCauMau[a][1]);
       for(let b = 0; b < LocCauMau[a][0].length; b++){
        // console.log(LocCauMau[a][0][b], LocCauMau[a][0].length);
           arrTemp = convertStrtoArray(LocCauMau[a][0][b], " ");
            while(x < arrTemp.length){
                if(isUpper(arrTemp[x])){
                    arrNameTemp.push(arrTemp[x]);
                }
                x++;
            }

            // console.log(arrNameTemp);
            for(let y = 0; y < arrNameTemp.length; y++){
                regdexNum = new RegExp(y);
                // console.log(LocCauMau[a][1]);
                if(strKetQua){
                    strKetQua = strKetQua.replace(regdexNum, arrNameTemp[y]);
                    // console.log(strKetQua);
                } else {
                    // console.log(strKetQua);
                    strKetQua = LocCauMau[a][1].replace(regdexNum, arrNameTemp[y]);
                } 
            }

            KetQuaCau.push(strKetQua);
            strKetQua = "";
            arrNameTemp = [];
            x = 0;
        }
    
    }


    let GiaThietTempTrung = [],regdexHinh, strConLai;
   for(let p = 0; p < MauCauHinh.length; p++){
       regdexHinh =  new RegExp(MauCauHinh[p][0],'g');
       if(giathiet.match(regdexHinh)){
           strConLai = [...giathiet.match(regdexHinh)];
        //    console.log(strConLai);
           giathiet = giathiet.replace(regdexHinh,'');
           GiaThietTempTrung.push(strConLai);
       }
   }

   let GTHinh = [];
   for(let n = 0; n < GiaThietTempTrung.length; n++){
       GTHinh.push(...GiaThietTempTrung[n]);
   }

   console.log(GTHinh);
   let NgoaiLeGoc = [];
   if(giathiet.includes('góc')){
       [NgoaiLeGoc,giathiet] =  XuLyNgoaiLeGTChoGoc(GTHinh, giathiet);
   }
   if(GTHinh.length == 0)
        GiaThiet.value = [...GTHinh,...KetQuaCau,...BieuThucKQ,...LocGiaTri,...NgoaiLeGoc].join(';\n') + ';';
    else  GiaThiet.value = 'Cho ' + [...GTHinh,...KetQuaCau,...BieuThucKQ,...LocGiaTri,...NgoaiLeGoc].join(';\n') + ';';
}

// Xử lý ngoại lệ cho GÓC
function XuLyNgoaiLeGTChoGoc(arrHinh,strGT){
    let TENHINH = [], temp, GOCTEMP = [], QuyGoc, KETQUA = [];

    for(let i = 0; i < arrHinh.length; i++){
        temp = convertStrtoArray(arrHinh[i]," ");
        TENHINH.push(temp[temp.length - 1]);
    }

    for(let j = 0; j < TENHINH.length; j++){
       QuyGoc = TENHINH[j].split('');
    }
    GOCTEMP.push(QuyGoc[1] + QuyGoc[0] + QuyGoc[2]);
    GOCTEMP.push(QuyGoc[0] + QuyGoc[1] + QuyGoc[2]);
    GOCTEMP.push(QuyGoc[0] + QuyGoc[2] + QuyGoc[1]);
    
    let GocRutGon;
    
    for(let n = 0; n < QuyGoc.length; n++){
        strGT = strGT.replace(QuyGoc[n], GOCTEMP[n]);
        GocRutGon = strGT.match(/góc [A-Z][A-Z][A-Z](=| =)(| )([0-9]+)/g);
        console.log(GocRutGon);
        KETQUA.push(GocRutGon);
        strGT = strGT.replace(/góc [A-Z][A-Z][A-Z](=| =)(| )([0-9]+)/g, "");
    }
    

    let str  = KETQUA.join(' ');
    console.log(str);
    str = str.replace(/góc/g, '');
    console.log(str.trim().replace(/\s+/g, ' '));
    let tempArr = convertStrtoArray(str.trim().replace(/\s+/g, ' '),' ');
    console.log(tempArr);
    let KQCuoiCung = [];
    for(let x = 0; x < tempArr.length; x++){
        if(tempArr[x] === '='){
            let a = 'Góc('+ tempArr[x-1] +') = '+tempArr[x+1];
            KQCuoiCung.push(a);
        }
    }

    console.log(KQCuoiCung);

    return [KQCuoiCung, strGT];

}



/* ================================
    XỬ LÝ PHẦN KẾT LUẬN 
====================================*/
function XuLyKetLuan(strKetLuan) {
    let TAMGIAC = [], TUGIAC = [], DOANTHANG = [], GOC = [], CHUNGMINH = [] , BIEUTHUC = [];
    // console.log(strKetLuan);

    if(strKetLuan.match(/[A-Z][A-Z][*-+][A-Z][A-Z] = [A-Z][A-Z][*+-][A-Z][A-Z]/g)){
        // console.log(strKetLuan.match(/[A-Z][A-Z][*-+][A-Z][A-Z] = [A-Z][A-Z][*+-][A-Z][A-Z]/g));
        BIEUTHUC.push(strKetLuan.match(/[A-Z][A-Z][*-+][A-Z][A-Z] = [A-Z][A-Z][*+-][A-Z][A-Z]/g));
        strKetLuan = strKetLuan.replace(/[A-Z][A-Z][*-+][A-Z][A-Z] = [A-Z][A-Z][*+-][A-Z][A-Z]/g,'');
        BIEUTHUC = [...BIEUTHUC[0]];
    }
    // console.log(BIEUTHUC);
   
    [TAMGIAC, strKetLuan] = XuLyTrungKhopMau(MauCauKetLuan,strKetLuan);
    // console.log(TAMGIAC);
    
    console.log(strKetLuan);
    [CHUNGMINH, strKetLuan] = XuLyTrungKhopMau(MauCauChungMinh,strKetLuan);
    // console.log(CHUNGMINH);
    // console.log(strKetLuan);
    
    if(strKetLuan.match(/[A-Z][A-Z][A-Z]/g)){
        GOC = strKetLuan.match(/[A-Z][A-Z][A-Z]/g);
        strKetLuan = strKetLuan.replace(/[A-Z][A-Z][A-Z]/g,'');
    }
    // console.log(strKetLuan);
    GOC = XuLyQuyUocGoc(GOC);

    if(strKetLuan.match(/[A-Z][A-Z]/g)){
        DOANTHANG = strKetLuan.match(/[A-Z][A-Z]/g);
        strKetLuan = strKetLuan.replace(/[A-Z][A-Z][A-Z]/g,'');
    }
    // console.log(strKetLuan);

    if(strKetLuan.match(/[Tt]ính/))
        KetLuan.value = 'Tính: ' + [...CHUNGMINH,...TAMGIAC,...TUGIAC,...DOANTHANG,...GOC].join(',') + ';';
    else KetLuan.value = 'Chứng minh rằng: ' + [...CHUNGMINH,...BIEUTHUC,...TAMGIAC,...TUGIAC,...DOANTHANG,...GOC].join(',') + ';';
   
}


function XuLyTrungKhopMau(arr, strKL){

    let Mau = [], redexMau, strTemp,strMauCau,strMauTemp = [];

    // console.log(strKL);
    
    for(let i = 0; i < arr.length; i++){
        redexMau = new RegExp(arr[i][0], 'g');
        // console.log(redexMau);
        if(strKL.match(redexMau)){
            strTemp = [...strKL.match(redexMau)];
            strMauCau = arr[i][1];
            let temp = []; temp.push(strTemp); temp.push(strMauCau);
            strMauTemp.push(temp);
            strKL = strKL.replace(redexMau,'');
            // console.log(strKL);
            strKL = strKL;
        } else continue;
    }

    let strMauArr;
    for(let n = 0; n < strMauTemp.length; n++){
        // console.log(strMauTemp[n]);
        strMauArr = XuLyChuyenDoiChuoi(strMauTemp[n][0], strMauTemp[n][1]);
        // console.log(strMauArr);
        Mau.push(strMauArr);      
    }
    // console.log(strKL);
    return [Mau,strKL];
}


function XuLyChuyenDoiChuoi(arr, str){
    let arrStr, KetQuaKl, arrKetQua = [];
    // console.log(arr);
    for(let i = 0; i < arr.length; i++){
        // console.log(arr[i]);
        KetQuaKl = '';
        arrStr = convertStrtoArray(arr[i],' ');
        // console.log(arrStr);
        let x = 0, nameArr = [];
        while(x < arrStr.length){
            if(isUpper(arrStr[x])){
                nameArr.push(arrStr[x]);
            }
            x++;
        }
        // console.log(nameArr);
        let l = 0;
        while(l < nameArr.length){
            let regdexIndex = new RegExp(l,'g');
            if(KetQuaKl)
                KetQuaKl = KetQuaKl.replace(regdexIndex,nameArr[l]);
            else KetQuaKl = str.replace(regdexIndex,nameArr[l]);
            l++
        }
        // console.log(KetQuaKl);
        arrKetQua.push(KetQuaKl);
        // console.log(str);
    }
    return arrKetQua;
}

function XuLyQuyUocGoc(arr){
    let tempName;
    for(let i = 0; i < arr.length; i++){
        tempName = 'Góc('+arr[i]+')';
        arr[i] = tempName;
    }


    return arr;
}


/* ================================
   HÀM XỬ LÝ 
====================================*/

///Chuyển đổi string sang mảng
function convertStrtoArray(str, character){
    return str.split(character);
}

//CHuyển chuỗi thành 1 kiểu định dạng
function convertStrtoUpperCase(str){
    return str.toUpperCase();
}
function convertStrtoLowerCase(str){
    return str.toLowerCase();
}


/* =================================
    Xóa các khoảng trống dư thừa
    Xóa các ký tự đặc biệt
====================================*/
function XoaCacKyHieu(str){
    return str.replace(/[\n,.;)(:\/?#$@!%&]|cm|km|mm|cm2|mm2|deg|hm|dam|dm|mm|m2|km2/g,' ').trim().replace(/\s+/g, ' ');
    // str.replace(/\n/g,'').replace(/[,.]/g,' ').replace(/cm/g,'');
}


// Kiểm tra  là toàn chữ là in hoa
function isUpper(str) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
}


//TODO: Xóa các từ đã xử lý thông qua chỉ số
function removeArrbyIndex(arr,arrIndex){

    for(let i = 0; i < arrIndex.length; i++){
        arr[arrIndex[i]] = '';
    }

    arr.join('');
    return convertStrtoArray(arr.join(' ').trim().replace(/\s+/g, ' '), ' ');    
}




//Xóa các từ thông dụng
function XoaTuThua(str){
    let redexWord, tempStr;
    DSTuXoa.pop();
    for(let i= 0; i< DSTuXoa.length; i++){
        redexWord =  new RegExp(DSTuXoa[i],'g');
        if(tempStr){
            tempStr = tempStr.replace(redexWord,' ');
        } else {
            tempStr = str.replace(redexWord,' ');
        }
    }

    return tempStr.trim().replace(/\s+/g, ' ');
}

// TODO:  đọc file data text
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                // alert(allText);
            }
        }
    }
    rawFile.send(null);

    return allText;
}
// Tạo các QUY ƯỚC CHUYỂN ĐỔI TỪ
function XuLyQuyUoc(pathStr){
    let DsQuyUoc;
    let QuyUoc = convertStrtoArray(readTextFile(pathStr),';');
    QuyUoc.pop();
    DsQuyUoc = QuyUoc.map(function(e){
        return convertStrtoArray(e,'>')
    })

    return DsQuyUoc;
}

function XuLyChuyenDoiQuyUoc(str, arr) {
    let tempStr, rexDeg;

    for(let i = 0; i < arr.length; i++){
        rexDeg = new RegExp(arr[i][0], 'g');
        if(tempStr){
            tempStr = tempStr.replace(rexDeg,arr[i][1]);
        } else {
            tempStr = str.replace(rexDeg,arr[i][1]);
        }
    
    }

    return tempStr.trim().replace(/\s+/g, ' ');
}