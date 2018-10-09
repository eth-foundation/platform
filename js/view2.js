
$$.QR = i => {
    var size = i.width || 150;
        i.text = i.text || " ";
        
    new QRCode(qrdom = $div(null, {class: "qr-code"}).css({
        'min-width': size+'px',
        'min-height': size+'px'
    }), {width: size, height: size, text: i.text});

    return $$([ qrdom ]);
}
$$.inpQR = i => 
    {
        var size = i.width || 150;
        i.text = i.text || "SOME TEXT";
        var qrdom = $div().css({
            width: size+'px',
            height: size+'px'
        });
        var ff = e => new QRCode(qrdom.cls(), {width: size, height: size, text: '' + inp});
        var inp = $input().text(i.text).events({
            onkeydown: ff, onkeyup: ff
        });
        ff();
        if(i.input){

            return $$([ qrdom, inp ]);
        }
        return $$([ qrdom, $div(i.text) ]);
    };

$$.address = i => $$([{ QR: { text: i } }, {h3_address: i} ]);


$$.header = i => $$([
    $img({
        src: i.logoURL, 
        class: 'noborder logo'
    }), {
        h1_noborder: i.title
    },
    {ethPriceHeader: i.curse}
]).addClass('header');


$$.content = i => {
    i.interface.content = $div();
    // console.warn('i.interface >> ', i.interface)
    return $$([
        i.interface.content
    ]).css({padding: '2rem'})
};


$$.body = interface => {
    interface.curse = $span();
    return $$([{
        header: {
            logoURL: '/img/logo.png',
            title: 'FDDP',
            curse: interface.curse
        },
        content: {
            interface: interface
        },
        footer:[
            $hr(),
            $h3('Socials: '),
            _('social'),
            $hr(),
            $h3('View on Etherscan: '),
            [
                {text: 'etherscan.io DT5', url: 'https://ropsten.etherscan.io/address/0x7d9d4a32005dc67403d582f205696dc6dfa286de'},
                {text: 'etherscan.io DT10', url: 'https://ropsten.etherscan.io/address/0xB123d8faeC8aFDDa5e949286FebB24709FB5d3fC'},
                {text: 'etherscan.io DT15', url: 'https://ropsten.etherscan.io/address/0xf28BB4f9e0eDcf6567606B1ac69c999117f4cB47'},
                {text: 'etherscan.io FDA', url: 'https://ropsten.etherscan.io/address/0x3dbca7378B7f78fe6255Ba6c39203f8511a2216e'},
            ].map(a => $a(a.text, {target: '_blank', href: a.url}).css({
                color: '#eeF',
                display: 'block'
            }))
        ],
        'bg-line': '', // 
        'bg-line2': '', // 
    }]).addClass('noborder');
};

function View () { 
    this.interface = {};
    $.write('body', $$.body(this.interface).addClass('loadupAnim'));
}

(() => {
    var instance = null;
    View.prototype = {
        addEventListener: (type, callback) => {

        },
        setPage: page => {
            
        },
        addContent: content => {
            View.instance().interface.content.cls().add(content);
        },
        setCourseInHead: el => {

            View.instance().interface.curse.cls().add(el);
        }
    };
    View.instance = () => {
        if(!instance) instance = new View();
        return instance;
    };
    
    function updatePage() {
        //doc.set(page[window.location.hash.split('#')[1]] || page.home);
        TRANSLATE.setLang(window.location.pathname.split('/')[1])
        var el = _$('.menu a[href]');
        
        el.forEach(a => a.removeClass('active'));
        el = $('a[href="' + window.location.hash + '"]');
        if (el) el.addClass('active')
        //else $('a[href="#home"]').addClass('active');
    }
    window.onhashchange = updatePage;
    updatePage();

})();