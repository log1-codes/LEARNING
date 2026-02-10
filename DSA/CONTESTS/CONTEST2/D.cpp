#include<iostream>
using namespace std;
int main()
{
    long long A, B; 
    cin>>A>>B ;
    //Agar  A and B same hain then only A! = B! 
    // Is case mein answer "No" hoga as A! != B! is false
    if(A==B)
    {
        cout << "Yes";
    }
    //special cases :
    //0! = 1! = 1 
    //islie if (A =0 , B=1) ya (A=1 , B=0) ho then only factorial equal hoge
    else if((A==0 && B==1) || (A==1 && B==0))
    {
        cout<<"Yes";
    }else{
        cout<<"No";
    }
    return  0 ;
}