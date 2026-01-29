#include <bits/stdc++.h>
using namespace std;
int sum2(int a , int b )
{
    return a+b;
}
int sum3(int a , int b, int c)
{
    return a +b+c ;
}
void print1toN(int n)
{
    for(int i =1 ; i<=n; i++)
    {
        cout<<i<<" ";
        
    }
    cout<<endl;
}
void printSqaure(int n , char ch)
{
    for(int i =1 ;i<=n; i++)
    {
        for(int j =1 ; j<=n; j++)
        {
            cout<<ch;
        }
        cout<<endl;
    }
}
void f(int n)
{
    cout<<"hello, I am function f"<<endl;
    return ; 
    cout<<n<<endl;
}
int factor(int n)
{
    int count=0 ;
    for(int i =1; i<=n ;i++)
    {
        if(n%i==0)
        {
            count++;
            cout<<i<<" count"<<count<<endl;
        }
    }
    return count ;
}
void prime(int n){
    int result = factor(n) ;
    if(result >2){
        cout<<"not prime";
    }else{
        cout<<"prime";
    }
}
int main() {
    // print1toN(10);
    // print1toN(55);
    // printSqaure(4, 'a');
    // printSqaure(4, '&');
    // printSqaure(4, '$');
    // printSqaure(4, '#');
    
    // f(10);
    // f(20);
    // factor(25);
    // cout<<"-------------------------"<<endl;
    // factor(12);
    prime(12);
}
