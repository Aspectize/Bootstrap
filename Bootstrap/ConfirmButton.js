/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisenseLibrary.js" />

Aspectize.Extend("ConfirmButton", {

    Binding: 'SimpleBinding',
    Properties: {
        Text: 'ConfirmButton', ToolTip: '', Title: '', Message: '', ModalSize: '',
        CancelBtnText: 'Cancel', CancelBtnClass: 'btn-default', CancelBtnToolTip: '',
        ConfirmBtnText: 'Ok', ConfirmBtnClass: 'btn-primary', ConfirmBtnToolTip: ''
    },
    Events: ['OnNeedMessage', 'OnConfirm', 'OnCancel'],

    Html: [
"<div class='modal fade' tabindex='-1' role='dialog'>" +
"  <div class='modal-dialog' role='document'>" +
"    <div class='modal-content'>" +
"      <div class='modal-header'>" +
"        <h4 class='modal-title'></h4>" +
"      </div>" +
"      <div class='modal-body'></div>" +
"      <div class='modal-footer'>" +
"        <button name='aasCancel' type='button' class='btn btn-default'></button>" +
"        <button name='aasConfirm' type='button' class='btn btn-primary'></button>" +
"      </div>" +
"    </div>" +
"  </div>" +
"</div>",

""
    ],

    appendBootstrapModalToDocument: function (id, k) {

        modalHtml = this.Html[k];
        var div = document.createElement('div');
        div.id = id; div.className = 'hidden';
        div.innerHTML = modalHtml;
        document.body.appendChild(div);

        return div;
    },

    Init: function (elem, controlInfo) {

        var version = '';
        var idModal = elem.id + '-Modal';

        var modalDisplayed = false;
        var modalContainer = null;
        var bsModal = null;
        var bsDialog = null;
        var bsBody = null;
        var bsHeader = null;

        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            version = bootstrap.Tooltip.VERSION; // Bootstrap 5
        } else if (typeof $.fn.tooltip !== 'undefined' && $.fn.tooltip.Constructor) {
            version = $.fn.tooltip.Constructor.VERSION; // Bootstrap 3 or 4

            modalContainer = this.appendBootstrapModalToDocument(idModal, 0);
            bsModal = modalContainer.querySelector('.modal');
            bsDialog = bsModal.querySelector('.modal-dialog');
            bsHeader = bsModal.querySelector('.modal-header h4');
            bsBody = bsModal.querySelector('.modal-body');
        }

        var text = Aspectize.UiExtensions.GetProperty(elem, 'Text');
        var toolTip = Aspectize.UiExtensions.GetProperty(elem, 'ToolTip');
        var btnClass = Aspectize.UiExtensions.GetProperty(elem, 'BtnClass');

        if (text) elem.innerHTML = text;
        if (toolTip) elem.title = toolTip;

        var cancelBtn = bsModal.querySelector(".modal-footer [name='aasCancel']");
        cancelBtn.innerHTML = Aspectize.UiExtensions.GetProperty(elem, 'CancelBtnText');
        cancelBtn.className = 'btn ' + Aspectize.UiExtensions.GetProperty(elem, 'CancelBtnClass');
        cancelBtn.title = Aspectize.UiExtensions.GetProperty(elem, 'CancelBtnToolTip');

        var okBtn = bsModal.querySelector(".modal-footer [name='aasConfirm']")
        okBtn.innerHTML = Aspectize.UiExtensions.GetProperty(elem, 'ConfirmBtnText');
        okBtn.className = 'btn ' + Aspectize.UiExtensions.GetProperty(elem, 'ConfirmBtnClass');
        okBtn.title = Aspectize.UiExtensions.GetProperty(elem, 'ConfirmBtnToolTip');

        function showModal(message) {

            if (modalDisplayed) {
                var size = Aspectize.UiExtensions.GetProperty(elem, 'ModalSize');
                if (size) bsDialog.className = 'modal-dialog ' + size;

                bsHeader.innerHTML = Aspectize.UiExtensions.GetProperty(elem, 'Title');
                bsBody.innerHTML = message;
                modalContainer.classList.remove('hidden');
                $(bsModal).modal('show');
            }
        }

        function closeModal(notify) {

            modalDisplayed = false;
            $(bsModal).modal('hide');
            modalContainer.classList.add('hidden');
            if (notify) Aspectize.UiExtensions.Notify(elem, 'OnCancel', elem);
        }

        Aspectize.AddHandler(modalContainer, "click", function (e, eArgs) {
            var srcName = eArgs.target.name;
            switch (srcName) {

                case 'aasConfirm':
                    Aspectize.UiExtensions.Notify(elem, 'OnConfirm', elem);
                    closeModal(false);
                    break;
                case 'aasCancel':
                    closeModal(true);
                    break;
            }
        });

        Aspectize.AddHandler(elem, "click", function (e, eArgs) {

            modalDisplayed = true;
            var message = Aspectize.UiExtensions.GetProperty(elem, 'Message');
            if (message) {

                showModal(message);
            } else {
                // The modal will be shown when we receive the message.
                // The return string of the bound command to OnNeedMessage 
                // must update the Message property of this control, for this to happen. 
                Aspectize.UiExtensions.Notify(elem, 'OnNeedMessage', elem);
            }
        });

        Aspectize.UiExtensions.AddMergedPropertyChangeObserver(elem, function (sender, arg) {

            if (arg.Text) elem.innerHTML = arg.Text;
            if (arg.ToolTip) elem.title = arg.ToolTip;
            if (arg.BtnClass) elem.className = 'btn ' + arg.BtnClass;

            if (arg.Title) bsHeader.inerHTML = arg.Title;
            if (arg.Message) {
                bsBody.innerHTML = arg.Message;
                showModal(arg.Message);
            }

            if (arg.CancelBtnText) cancelBtn.innerHTML = arg.CancelBtnText;
            if (arg.CancelBtnClass) cancelBtn.className = 'btn ' + arg.CancelBtnClass;
            if (arg.CancelBtnToolTip) cancelBtn.title = arg.CancelBtnToolTip;

            if (arg.ConfirmBtnText) okBtn.innerHTML = arg.ConfirmBtnText;
            if (arg.ConfirmBtnClass) okBtn.className = 'btn ' + arg.ConfirmBtnClass;
            if (arg.ConfirmBtnToolTip) okBtn.title = arg.ConfirmBtnToolTip;

        });

    }
});

