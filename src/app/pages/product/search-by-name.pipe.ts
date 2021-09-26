import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myFilter'
})
export class MyFilterPipe implements PipeTransform {

  transform(items: any[], keyword: any, keyword2: any, properties: string[], properties2: string[]): any[] {
      console.log('Items');
      console.log(items);
      
      
    if (!items) return [];
    if (!(keyword) && !(keyword2)) return items;    
    return items.filter(item => {     
      var itemFound: Boolean;   
          if (keyword && item.attributes[properties[0]].toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
            return false;
            
          } 
          if (keyword2 && item.attributes[properties2[0]].toLowerCase().indexOf(keyword2.toLowerCase()) === -1) {
            return false;
            
          }        
      return true;
    });

  }
}