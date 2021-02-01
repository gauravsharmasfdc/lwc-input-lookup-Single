public with sharing class lightningInputLookupController {
    @AuraEnabled(cacheable=true)
    public static list<sObject> fetchRecords(String sObjectApiName,String searchTerm){
        list<sObject> sObjectList= new list<sObject>();
        String searchText= '%'+searchTerm+'%';
        
            String query='SELECT ID,Name FROM '+sObjectApiName +' WHERE Name LIKE :searchText  ORDER BY Name LIMIT 10';
           for(sObject record : Database.query(query)){
               sObjectList.add(record);
           }
        
        return sObjectList;
    }
}
