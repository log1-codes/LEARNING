#include<bits/stdc++.h>
using namespace std;

bool factor(int n)
{
    int count=0 ;
    for(int i =1; i<=n ;i++)
    {
        if(n%i==0)
        {
            count++;
        }
    }
    return count == 2;
}
void prime(int n){

    if( factor(n)){
        cout<<"Prime";
    }else{
        cout<<"Not Prime";
    }
}

int main()
{
    int n ;
    cin>>n;
    prime(n);
}