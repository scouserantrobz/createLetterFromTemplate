# createLetterFromTemplate

This script allows users to create a copy of the current Google Document, and replace a series of user defined placeholders with values entered through a dialog box. The placeholders and possible replacement values are defined in an accompanying Google Sheet, which you can set in the dialog box.

### Example in Pictures:
![createDocument](https://user-images.githubusercontent.com/88899800/151726127-78a656b3-317e-4f64-8276-e29af19a0479.gif)

### About
The two templates files are:

1. the Google Document - [use this link to create a copy](https://docs.google.com/document/d/1R3TYTBHknFR_jE6D1Yv6KEK7pRFBT4UG8aY5Tg8jkEc/copy). This is the document contains the Google Apps script. You can then edit the document to reflect your own template design
2. the Google Sheet - [again use this link to create your own copy of this template](https://docs.google.com/spreadsheets/d/1hraVk9ZNjrlN1bkIKbu0dkT66E7oAHl-Og-GCqA763c/copy). There is no script in this file, and you'll need to use the file ID value of the new copy when you run the script

### Walking Through an Example:

- #### Edit the Google Sheet
  - Once you have copied the two document, edit the Google Sheet first. Start be deleting all the data in the range C7:G19 on the *settings* sheet, and removing the ticks from cells H13 and H18
  - Next you can start to enter the placeholders that will appear in your document. We will use the following example, which reflects a very simple letter.  
    ![recreatethis](https://user-images.githubusercontent.com/88899800/151723409-ed5d3f3a-f6a6-46c9-bba7-96b60c48dc4d.png)
    
  - The three placeholders are going to define are as follows, and replace the text hightlighted in green in the image above:
       * District: this will be choice of the 6 districts in Belize,
       * Client Name: this will be textbox to allow you to enter any name (with a default of Sir/Madam), 
       * Letter date (which we'll set as the current date when you run the script)
  - We start by selecting the type of placeholder we want for the district value. We want to display a dropdown list of the six districts in Belize in the dialog box, so we will select "Drop down list" in cell C7. 
  - You'll notice that E7 is now highlighted in red (see below), indicating that for each row where the input tupe is "Drop down list", we must enter a value in column E. We'll fix this in the next couple of steps.  
    ![selectError](https://user-images.githubusercontent.com/88899800/151723526-2cfea50e-1fdc-4311-abe5-031347f4fee3.png)

  - In cell D7 we'll enter the placeholder text itself, which has to be surrounded by double curly brackets - enter {{DISTRICT}}. It doesn't have to in uppercase, but it **must match exactly** what we have in the Google Doc. In the next column we enter the first of the six districts - Corozal. In cell F7 we enter the text we want to display in the dialog box for this placeholder - we'll enter "Pick a district". If we wanted to set Corozal as the default, you could enter that value in G7, but we'll leave it blank. The last setting for district will be to make it mandatory to complete before creating the new document - so we put a tick into cell H7.
  - So after this first row of settings has been entered, the sheet should look like this:  
    ![afterRow1](https://user-images.githubusercontent.com/88899800/151723511-b0fffae2-c8cd-4ad6-8c8b-200c7c571011.png)
  - We can copy the values in C7 and D7 down another 5 rows where we'll enter the other 5 districts. Once we have done that, and entered Orange Walk, Belize, Cayo, Stann Creek and Toledo into column E, the sheet should look like this  
    ![afterDistrict](https://user-images.githubusercontent.com/88899800/151723533-aea66308-dbb0-4c17-b8ed-7f554a7ab052.png)
  - Next we add our second placeholder - the client's name. We want this to be a simple textbox where you can enter any value, so in the next row select the type to be "Text" in column C. In column D we'll enter the placeholder value of {{CLIENTNAME}}, column E will be blank (this is only used for drop down lists) and in column F we'll type "Client name", and in column G we'll enter the default value we wish to see - "Sir/Madam".
  - And the last placeholder we'll define is the date field. This will be another textbox, so in column C we enter "Text" again. For the placeholder we'll enter {{TODAY}} in column D, and the text we want to see on the dialog box will be "Todays' date" - which we enter into column F. Finally the default value is set to {{DATE}} which will be recognized by the script, and replaced with the current date. It will look similar to this example: 29th June, 2022
  - So our sheet should look like this:  
    ![final_sheet](https://user-images.githubusercontent.com/88899800/151723583-1adab93d-c080-4268-aba2-9bcdfa3f0aca.png)
  
- #### Edit the Google Doc
    - We can now edit our Google Doc template, and add in the three placeholders. Our basic example will look like the image shown below, though you can design your template any way you like. The only restriction is that replacements are only made in the body of the document, and not the header nor footer. Remember to ensure the placeholders exactly match the text entered in the sheet. The formatting of the placeholders is irrelevant, so you can apply any style to them.
    
- #### Run the Script from the Menu
  - This example assumes you're authorized the script to run, and so by clicking on the menu () the following dialog box should appear.  
    ![app1a](https://user-images.githubusercontent.com/88899800/151723365-bcbce148-79b6-436f-9ec6-3444b2be0d4b.jpg)    
  - Before we go any further, we need to link the Doc to the Sheet - so we copy the sheet ID from the url (see the hightlighted value in the image below as an example of a sheet ID). Paste this into the box at the top of the dialog, and click the "Set sheet" button.  
    ![sheetId](https://user-images.githubusercontent.com/88899800/151723779-6025271c-b36b-40e3-a86d-1e93a61dafbf.png)

  - Once the two documents have been linked, the script will read our config settings, and display them for us ini the dialog (see below).  
    ![dialogBoxWithInputs](https://user-images.githubusercontent.com/88899800/151723843-501bca39-156f-468b-b04d-88c754ba3df9.png)

  - You'll notice that we have the three placeholders, with input boxes for client name and today, and a drop down list for district. The display text for district also has an asterix after it, denotes that this field cannot be left blank when creating the new document.
  - In fact if we click the "Create letter" button, we'll see two errors:  
    ![errors](https://user-images.githubusercontent.com/88899800/151723986-1b82c5fa-31f0-4c08-94c4-9f7ffb16f20f.png)

  - The first is district is blank, so that input is highlighted in red, and the second is the name of the new document is blank, so that is also highlighted in red too. There are also two messages shown explaining this. So let's fix these, and then click the create button again.  
    ![createDialog](https://user-images.githubusercontent.com/88899800/151724103-cbfcc79e-470e-49f8-9a27-ab91eea5713f.png)

  - Once the document is ready, a link to it is displayed at the bottom, which you can click to open it in a new tab/window.  
    ![newLink](https://user-images.githubusercontent.com/88899800/151724139-a04d552a-b482-4c6f-914f-2f9e18e30828.png)

  - The new document looks like this:  
    ![finalDoc](https://user-images.githubusercontent.com/88899800/151724163-1d866c97-beeb-4270-b851-e97f21b8ab77.png)

  - You can see the three placeholders have been replaced with the text from the dialog box (the three highlighted pieces of text above)

### More Options:
  - You can use the following placeholders to enter various date elements, such as the current day of the week, or the current Month
    
    | Default Code         | Description                        | Example  |
    | --------------------:|:----------------------------------:| ------|
    | {{DATE}}             | The current date                   | 1st December, 2022 / 23rd June, 2022 |
    | {{TIME}}             | The curent time                    | 09:15:20 / 21:04:05 |
    | {{MONTHNUM}}         | The current month number           | 1 / 5 |
    | {{MONTHNAMELONG}}    | The current month name in full     | December / June |
    | {{MONTHNAMESHORT}}   | The current month name abbreviated | Dec / Jun |
    | {{DAYNUM}}           | The current day number             | 24 / 3 |
    | {{DAYNAMELONG}}      | The current day name in full       | Monday / Wednesday |
    | {{DAYNAMESHORT}}     | The current day name abbreviated   | Mon / Wed |

- You can also let the script autoincrement each document by defining a placeholder called {{AUTOINC}} with the default value of {{AUTOINC}}. When you first define this, the value will be blank, allowing you to enter the first number you want to use. The value must be an integer, and from then on, it will increment by one after every time you create a document.
  - So the entry in the config sheet should look like this:  
    ![autoInc](https://user-images.githubusercontent.com/88899800/151725303-a54ea8c1-1e4c-410d-ac53-4c38daeef535.png)

  - Then when you next run the script, the dialog lists the placeholder but without any value  
    ![autoInc_1](https://user-images.githubusercontent.com/88899800/151725312-6b2735ca-8974-40ed-8906-31717d54c90e.png)
    
  - Enter an integer for the first document, and thereafter it will automatically increment by one
