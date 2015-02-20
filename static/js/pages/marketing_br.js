require.config({
    paths: {
         /**
         * Require plugin rating file.
         * <b><i>plu_marketing_br: jsSubFolderPlugins+'marketing_br'<br /></i></b>
         * @property require(['plu_marketing_br'])
         * @type File
         */
         plu_rate: jsSubFolderPlugins + 'jquery.marketing_br' + jsMinified,
    }
});


 /// Chosen Plugin is always necessary and has a general class



require(['pag_marketing_br'], function(){
  /* ------------------
   * Marketing pages br
   * ------------------ 
   */
  var destinationurl="/shopping/women/bags-purses-1/items.aspx";
  var landingpage="bra_ins_bol_goo_dis_branding";
  var brsubs = "/brsubs.aspx";

  function textBox_Change(txtbox)
  { 
    document.getElementById("link_lp").href = brsubs+"?email="+txtbox.value+"&landing_page="+landingpage+"&destinationurl="+destinationurl;
  }

  function textKeyPress(txtbox){  
    if (document.layers)    
      {
        document.captureEvents(Event.KEYDOWN);    
      }
                    
      document.onkeydown = function (evt) {
        var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;            
        if (keyCode == 13) {  
          sendToPage();
          return false;    
        }     
        else   
        {
          return true;
        }
      }
    }

    function sendToPage()
    {
      var email = $('input[name=email]').val();
      var href = brsubs+"?email=" +email +"&landing_page="+landingpage+"&destinationurl="+destinationurl;
      href = $('<div/>').html(href).text();
      document.getElementById("link_lp").href = href;
      window.location=document.getElementById("link_lp").href; 
    }

    $('.privacidadelink').click(function(e){
      e.preventDefault();
      $(".privacidadetexto").toggleClass("privacidadetexto_show"); 
      $('#link_lp').on('click', function(evt) { 
        sendToPage(); 
      } 
    );
  });


   /* ----------------------
    * End Marketing pages br
    * ---------------------- 
    */
 });       