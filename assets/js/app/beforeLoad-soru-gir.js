/** anlık zamanı soru gir kısmında gösterir
 *  muaz wrote with support by dilruba - 20200527-005746
 *  diyagram: https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgRyhiYcWfbGEpLS0-QVxuICBBW2FubMSxayB6YW1hbiBkZcSfZXJpIG9sdcWfdHVyXSAtLT4gQih0YXJpaGkgdGFuxLFtbGEpXG4gIEIgLS0-IEModGFyaWhpIHNvcnUgZ2lyIGvEsXNtxLFuZGEgZ8O2csO8bnTDvGxlKVxuICBDLS0-RChzYWF0aSB0YW7EsW1sYSlcbiAgRC0tPkUoc2FhdGkgc29ydSBnaXIga8Sxc23EsW5kYSBnw7Zyw7xudMO8bGUpXG4gIEUtLT5GKG1pbGlzYW5peWV5aSBnaXpsaSBlbGVtZW50ZSB0YW7EsW1sYSlcbiAgRi0tPkgoYml0aXIpIiwibWVybWFpZCI6eyJ0aGVtZSI6ImZvcmVzdCJ9fQ
 */
function anlikZamaniSoruGirKismindaGoster() {
    // anlık zaman değeri oluştur
    var d = new Date();

    // tarihi tanımla
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = '' + d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    // tarihi soru gir kısmında görüntüle
    document.getElementById("dateSoru").value = [year, month, day].join('-');

    // saati tanımla
    hours = '' + d.getHours();
    minutes = '' + d.getMinutes();
    seconds = '' + d.getSeconds();
    millisecond = '' + d.getMilliseconds();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    switch (millisecond.length) {
        case 1:
            millisecond = '00' + millisecond;
            break;
        case 2:
            millisecond = '0' + millisecond;
            break;
    }

    // saati soru gir kısmında görüntüle
    document.getElementById('timeSoru').value = [hours, minutes, seconds].join(':');

    // milisaniyeyi gizli elemente tanımla
    document.getElementById('millisecondSoru').innerText = millisecond;
}


function anlikZamaniKonuCalismaSuresiGirKismindaGoster() {
    // anlık zaman değeri oluştur
    var d = new Date();

    // tarihi tanımla
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = '' + d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    // tarihi soru gir kısmında görüntüle
    document.getElementById("dateKonu").value = [year, month, day].join('-');

    // saati tanımla
    hours = '' + d.getHours();
    minutes = '' + d.getMinutes();
    seconds = '' + d.getSeconds();
    millisecond = '' + d.getMilliseconds();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    switch (millisecond.length) {
        case 1:
            millisecond = '00' + millisecond;
            break;
        case 2:
            millisecond = '0' + millisecond;
            break;
    }

    // saati soru gir kısmında görüntüle
    document.getElementById('timeKonu').value = [hours, minutes, seconds].join(':');

    // milisaniyeyi gizli elemente tanımla
    document.getElementById('millisecondKonu').innerText = millisecond;
}