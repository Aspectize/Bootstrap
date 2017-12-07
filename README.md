# Bootstrap
Aspectize Extension for Bootstrap

# 1 - Download

Download extension package from aspectize.com:
- in the portal, goto extension section
- browse extension, and find Bootstrap
- download package and unzip it into your local WebHost Applications directory; you should have a Bootstrap directory next to your app directory.

# 2 - Configuration

Add Bootstrap as Shared Application in your application configuration file.
In your Visual Studio Project, find the file Application.js in the Configuration folder.

Add Bootstrap in the Directories list :
```javascript
app.Directories = "Bootstrap";
```

# 3 - Modal view

Integration of Bootstrap Modal in your Aspectize app is easy.

Define control as Modal

```html
<div aas-control="name:'ModalSample', isModal:true">
   <div class="modal fade">
      <div class="modal-dialog">
         <div class="modal-content">
            <div class="modal-header">
               <h4 class="modal-title">Modal Title</h4>
            </div>
            <div class="modal-body">
               ...
            </div>
            <div class="modal-footer">
               <button class="btn btn-default" name="Cancel" data-dismiss="modal">Annuler</button>
               <button class="btn btn-primary" name="Confirm" data-dismiss="modal">Confirmer</button>
            </div>
         </div>
      </div>
   </div>
</div>
```

Define view: if Modal view is used to edit data, a good practise is to start a DataRecorder when view is Activated and Cancel when view is unactivated. A Save command allow to Save update before view is unactivated.

The view is displayed with the BootStrapClientService.ShowModal command, which has 3 parameters:
- the view Name
- an optional parameter to allow keyboard escape (default is true)
- an optional parameter to allow backdrop (default is true)

The view is hidden with BootStrapClientService.CloseModal command

```javascript
var myModalSample = Aspectize.CreateView('MyModalSample', aas.Controls.ModalSample);
myModalSample.OnActivated.BindCommand(aas.Services.Browser.DataRecorder.Start(aas.Data.MainData));
myModalSample.OnDeactivated.BindCommand(aas.Services.Browser.DataRecorder.CancelRowChanges(aas.Data.MainData));
myModalSample.Cancel.click.BindCommand(aas.Services.Browser.BootStrapClientService.CloseModal(aas.ViewName.MyModalSample));
myModalSample.Save.click.BindCommand(aas.Services.Server.MyDataBaseService.SaveTransactional(aas.Data.MainData));
myModalSample.Save.click.BindCommand(aas.Services.Browser.BootStrapClientService.CloseModal(aas.ViewName.MyModalSample));

...somebutton.click.BindCommand(aas.Services.Browser.BootStrapClientService.ShowModal(aas.ViewName.MyModalSample, false, false));
```
# 4 - Validation command

The Boostrap Extension provides 2 commands to display validation errors:
- DisplayValidator is used with Data validation
- DisplayValidatorCommand is used with Command validation

Define some input in your control:
```html
<div class="form-group">
   <label class="col-xs-4 control-label">Name :</label>
   <div class="col-xs-8">
       <input name="TxtName" type="text" class="form-control" />
       <p class="SmallError error-TxtName"></p>
   </div>
</div>
```

BindData with validation configuration : 
- if data is invalid the DisplayValidator command will automatically display the className corresponding to error-ControlName
- when Modal is saved, the DisplayValidatorCommand will displayed all errors within the form, and stop the Saving process

```javascript
myModalSample.TxtName.value.BindData(myModalSample.ParentData.Name, '', aas.Enum.BindingMode.OnValidation, true, aas.Enum.ErrorProcessor.Custom, 'Browser/BootStrapClientService.DisplayValidator');
myModalSample.Save.click.BindCommand(aas.Services.Server.MyDataBaseService.SaveTransactional(aas.Data.MainData), '', false, true, false, aas.ViewName.MyModalSample, aas.Enum.ErrorProcessor.Custom, 'Browser/BootStrapClientService.DisplayValidatorCommand');
```

