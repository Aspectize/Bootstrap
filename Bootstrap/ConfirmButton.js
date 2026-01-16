/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisenseLibrary.js" />

var getBootsrapVersion = (function () {

    var version = null;;


    return function () {

        if (version === null) {

            if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
                version = bootstrap.Tooltip.VERSION; // Bootstrap 5
            } else if (typeof $.fn.tooltip !== 'undefined' && $.fn.tooltip.Constructor) {
                version = $.fn.tooltip.Constructor.VERSION; // Bootstrap 3 or 4
            }
        }

        return version;
    };

})();

var getBootsrapClientService = (function () {

    var bsClientSvc = null;
    var bsVersion = getBootsrapVersion();

    return function () {

        if (bsClientSvc === null) {
            if (bsVersion[0] === '5') {
                bsClientSvc = Aspectize.GetService(aas.Services.Browser.BootStrap5ClientService);
            } else bsClientSvc = Aspectize.GetService(aas.Services.Browser.BootStrapClientService);
        }

        return bsClientSvc;
    };
})();

Global.BootStrapClient = {

    aasService: 'BootStrapClient',
    aasPublished: true,

    bsConfirmationViewName: null,
    bsConfirmButton: null,
    PrepareConfirmation: function (viewName, message, aasEventArg, keyboard, backdrop, draggable) {

        this.bsConfirmButton = aasEventArg.aasEventArg.target;
        this.bsConfirmationViewName = viewName;

        var bsClientSvc = getBootsrapClientService();
        bsClientSvc.ShowModal(viewName, !!keyboard, !!backdrop, !!draggable);

        var uiSvc = Aspectize.GetService(aas.Services.Browser.UIService);
        var divHtmlName = viewName + '-Message';
        var hasDivHtml = document.getElementById(divHtmlName);
        if (hasDivHtml) {
            uiSvc.SetControlProperty(divHtmlName, 'Html', message);
        } else uiSvc.SetControlProperty(viewName, 'Message', message);
    },

    SetConfirmButtonId: function (id, viewName) {

        this.bsConfirmButton = document.getElementById(id);
        this.bsConfirmationViewName = viewName;
    },
    CancelConfirmation: function () {

        var bsClientSvc = getBootsrapClientService();
        bsClientSvc.CloseModal(this.bsConfirmationViewName);
        this.bsConfirmationViewName = this.bsConfirmButton = null;
    },

    Confirmation: function () {

        Aspectize.UiExtensions.Notify(this.bsConfirmButton, 'OnConfirm', this.bsConfirmButton);

        var bsClientSvc = getBootsrapClientService();
        bsClientSvc.CloseModal(this.bsConfirmationViewName);
        this.bsConfirmationViewName = this.bsConfirmButton = null;
    }
};

Aspectize.Extend("ConfirmButton", {

    Binding: 'SimpleBinding',
    Properties: {
        ButtonText: 'ConfirmButton', ButtonToolTip: '',
        ViewName: '', Title: '', Message: '', BoundMessage: '', CloseOnEscape: false, CloseOnBackdropClick: false, Draggable: false
    },
    Events: ['OnNeedMessage', 'OnConfirm', 'Click'],

    Init: function (elem, controlInfo) {

        // elem is the div that is going to behave like a button (btn btn-primary)
        // The click on this button will show a bootstrap modal view (ViewName). 
        // The content and title of the modal are (Title, Message). 
        // If Message is empty the showing the modal will be delayed until a Message is bound.
        // This is notified to the App by OnNeedMessage event.
        // the modal view should have a Message property {Message} to display the message
        // or a Message HtmlDivControl controle if the message is Html.

        var confirmButtonId = elem.id;
        var modalDisplayDelayed = false;
        var bsClient = Aspectize.GetService(aas.Services.Browser.BootStrapClient);

        var text = Aspectize.UiExtensions.GetProperty(elem, 'ButtonText');
        if (text) elem.innerHTML = text;

        var toolTip = Aspectize.UiExtensions.GetProperty(elem, 'ButtonToolTip');
        if (toolTip) elem.title = toolTip;

        function showModal(message) {

            var viewName = Aspectize.UiExtensions.GetProperty(elem, 'ViewName');
            if (!viewName) return;

            bsClient.SetConfirmButtonId(confirmButtonId, viewName);

            var title = Aspectize.UiExtensions.GetProperty(elem, 'Title');

            var keyboard = Aspectize.UiExtensions.GetProperty(elem, 'CloseOnEscape');
            var backdrop = Aspectize.UiExtensions.GetProperty(elem, 'CloseOnBackdropClick');
            var draggable = Aspectize.UiExtensions.GetProperty(elem, 'Draggable');

            modalDisplayDelayed = false;

            var bsClientSvc = getBootsrapClientService();
            bsClientSvc.ShowModal(viewName, keyboard, backdrop, draggable);

            var uiSvc = Aspectize.GetService(aas.Services.Browser.UIService);

            var html = document.getElementById(viewName).innerHTML;
            var titleMatch = html.match(/\{Title\}/);
            if (titleMatch) {
                uiSvc.SetControlProperty(viewName, 'Title', title);
            }

            var divHtmlName = viewName + '-Message';
            var hasDivHtml = document.getElementById(divHtmlName);
            if (hasDivHtml) {
                uiSvc.SetControlProperty(divHtmlName, 'Html', message);
            } else uiSvc.SetControlProperty(viewName, 'Message', message);
        }

        Aspectize.AddHandler(elem, "click", function (e, eArgs) {
            
            var message = Aspectize.UiExtensions.GetProperty(elem, 'BoundMessage');
            if (message) {

                var viewName = Aspectize.UiExtensions.GetProperty(elem, 'ViewName');
                if (viewName) {
                    showModal(message);
                } else Aspectize.UiExtensions.Notify(elem, 'Click', elem);

            } else {
                // The modal will be shown when we receive the message.
                // The return string of the bound command to OnNeedMessage 
                // must update the Message property of this control, for this to happen.                
                Aspectize.UiExtensions.ChangeProperty(elem, 'Message', '');
                modalDisplayDelayed = true;
                Aspectize.UiExtensions.Notify(elem, 'OnNeedMessage', elem);
            }
        });

        Aspectize.UiExtensions.AddMergedPropertyChangeObserver(elem, function (sender, arg) {

            if (arg.ButtonText) elem.innerHTML = arg.ButtonText;
            if (arg.ButtonToolTip) elem.title = arg.ButtonToolTip;

            if (arg.Message) {
                if (modalDisplayDelayed) showModal(arg.Message);
            }
        });

    }
});

