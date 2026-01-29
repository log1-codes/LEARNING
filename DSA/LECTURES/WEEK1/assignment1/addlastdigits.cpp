#include<iostream>
using namespace std; 
int main()
{
    int a,b; 
    cin>>a>>b;
    int lastdigita = a%10; 
    int lastdigitb = b%10; 
    cout<<lastdigitb+lastdigita;
    return 0;
}